# Jenkins Test Failure Prevented Deployment

## Scenario

After successfully creating the Jenkins CI/CD pipeline, SCM polling was configured so that Jenkins could automatically detect new commits pushed to GitHub.

The application welcome message was changed to test the automatic pipeline trigger.

The application response was changed from:

```text
Hello from Jenkins CI/CD Pipeline!
```

to:

```text
Hello from Jenkins Automated CI/CD Pipeline!
```

However, the automated test was intentionally left unchanged.

## Error

The Jest test still expected the previous application response.

The test reported:

```text
Expected: "Hello from Jenkins CI/CD Pipeline!"
Received: "Hello from Jenkins Automated CI/CD Pipeline!"
```

The test results were:

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

Jenkins Build #2 therefore failed during the **Test** stage.

## Why It Happened

The application behavior had changed, but the corresponding automated test had not been updated.

`app.js` returned the new welcome message while `app.test.js` continued checking for the old message.

Because the expected and actual responses were different, Jest correctly marked the test as failed.

## CI/CD Behavior

The failed test demonstrated an important part of the pipeline.

The pipeline flow became:

```text
GitHub Push
     |
     v
Jenkins detects commit
     |
     v
Build
     |
     v
Test
     |
     X
   FAILED
     |
     v
Deploy Skipped
```

Because the pipeline failed during the Test stage, the Deploy stage was never reached. Jenkins therefore did not remove or replace the previously deployed Docker container.

The last successfully deployed version of the application continued running on port `3000`. This was verified by accessing the application after Build #2 failed and confirming that the previous application response was still being served.

This demonstrated that the failed application change was prevented from reaching the deployment stage.

## Resolution

The expected response in `app.test.js` was updated to match the intended application response:

```javascript
expect(response.text).toBe(
    "Hello from Jenkins Automated CI/CD Pipeline!"
);
```

The tests were then executed locally:

```powershell
npm test
```

Both tests passed.

The corrected test was committed and pushed to GitHub.

## Successful Build After the Fix

After the fix was pushed, Jenkins detected the new commit automatically through SCM polling.

Build #3 executed the complete pipeline:

```text
Build   → SUCCESS
Test    → SUCCESS
Deploy  → SUCCESS
```

The updated Docker container was deployed successfully.

The application then returned:

```text
Hello from Jenkins Automated CI/CD Pipeline!
```

and the health endpoint continued to return:

```json
{
  "status": "OK"
}
```

## Verification

The Jest test results showed:

```text
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

Jenkins Build #3 completed successfully and the updated application became available on port `3000`.

This confirmed that Jenkins detected the corrected commit, successfully validated the application, and deployed the new version only after the automated tests passed.

## Commands Used

Run the tests locally:

```powershell
npm test
```

Commit and push the corrected test:

```powershell
git add app.test.js
git commit -m "Update test for new welcome message"
git push
```

## What I Learned

Automated tests act as a deployment gate in a CI/CD pipeline.

A successful build alone should not automatically result in deployment. The application must also pass its validation tests.

This test failure demonstrated that Jenkins can stop the pipeline before deployment when application behavior does not match the expected behavior.

It also demonstrated that the previously deployed working application can remain available when a new pipeline fails before reaching the Deploy stage.

Finally, it showed the importance of keeping automated tests synchronized with intentional application changes.

## Key Takeaway

A well-designed CI/CD pipeline should prevent failed or unverified application changes from reaching the deployment stage. Only changes that successfully pass the required validation should proceed to deployment.