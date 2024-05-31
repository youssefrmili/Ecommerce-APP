pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
        SSH_CREDENTIALS_ID = 'ssh-id'
        MASTER_NODE = 'youssef@k8s-master'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: env.BRANCH_NAME]], // Checkout the current branch
                    userRemoteConfigs: [[url: 'https://github.com/youssefrmili/Ecommerce-APP.git']]
                ])
            }
        }
        stage('Send reports to Slack') {
            steps {
                slackUploadFile filePath: '**/Jenkinsfile', initialComment: 'Here is the Jenkinsfile'
                slackUploadFile filePath: '**/trivy-*.txt', initialComment: 'Here are the Trivy reports'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/trufflehog.txt, **/reports/*.html, **/trivy-*.txt'
        }
    }
}
