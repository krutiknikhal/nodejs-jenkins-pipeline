pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                bat 'npm ci'
                bat 'docker build -t nodejs-jenkins-app:latest .'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker rm -f nodejs-jenkins-container 2>nul || exit /b 0'
                bat 'docker run -d -p 3000:3000 --name nodejs-jenkins-container nodejs-jenkins-app:latest'
            }
        }
    }
}