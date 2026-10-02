# Jenkins Could Not Find Docker CLI

## Scenario

While preparing Jenkins to execute the CI/CD pipeline, the required tools were verified from the Jenkins environment.

Git, Node.js, and npm were accessible from Jenkins, but Docker was not recognized even though Docker Desktop and the Docker CLI were installed and available from the normal Windows PowerShell terminal.

## Error

Running Docker from Jenkins failed because Jenkins could not locate the `docker` executable.

A check for Docker from the Jenkins environment did not return a valid Docker executable.

However, from the normal PowerShell terminal, the Docker CLI was located at:

```text
C:\Users\krutik\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe
```

## Why It Happened

Jenkins was installed as a Windows service and was running under the `LocalSystem` account.

The Jenkins service had its own environment and `PATH`, which was different from the environment available to the logged-in Windows user.

Docker Desktop had installed the Docker CLI inside the user's local application directory:

```text
C:\Users\krutik\AppData\Local\Programs\DockerDesktop\resources\bin
```

This directory was not included in the `PATH` available to Jenkins.

As a result, Docker worked from the user's PowerShell terminal but Jenkins could not find the command.

## Troubleshooting

The Docker executable location was first verified from PowerShell:

```powershell
where.exe docker
```

The Jenkins environment was then checked using the Jenkins Script Console.

Git, Node.js, and npm were available, but Docker was not found.

To confirm that Jenkins could actually execute Docker when given the full path, the Docker executable was tested directly using:

```text
C:\Users\krutik\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe
```

The command executed successfully, confirming that the problem was the Jenkins `PATH` rather than the Docker installation itself.

## Resolution

The Docker CLI directory was added to the Jenkins environment.

In Jenkins:

```text
Manage Jenkins
→ System
→ Global properties
→ Environment variables
```

The following variable was added:

```text
Name:
PATH+DOCKER

Value:
C:\Users\krutik\AppData\Local\Programs\DockerDesktop\resources\bin
```

Jenkins supports the PATH+<NAME> convention for extending the PATH available to builds. By configuring PATH+DOCKER, the Docker CLI directory was added to the existing Jenkins build PATH without replacing the other paths already available to Jenkins.

## Verification

A temporary Jenkins Freestyle job named `tools-verification` was created. The verification job ran as the Windows SYSTEM account, which further confirmed that Jenkins was operating in a different environment from the logged-in Windows user.

The following commands were executed:

```bat
docker --version
docker version
whoami
git --version
node --version
npm --version
```

Jenkins successfully returned the installed versions of Docker, Git, Node.js, and npm.

The job finished with:

```text
Finished: SUCCESS
```

This confirmed that Jenkins could successfully access the Docker CLI.

## Commands Used

```powershell
where.exe docker
docker --version
docker version
```

Jenkins verification:

```bat
docker --version
docker version
whoami
git --version
node --version
npm --version
```

## What I Learned

A tool being available from a user's terminal does not automatically mean that the same tool is available to Jenkins.

Jenkins running as a Windows service can have a different user account and environment variables from the interactive Windows user.

Checking the environment from Jenkins itself is therefore important when troubleshooting command-not-found problems.

## Key Takeaway

When Jenkins cannot find an installed command, verify the environment and `PATH` available to the Jenkins service instead of assuming the installation is missing.