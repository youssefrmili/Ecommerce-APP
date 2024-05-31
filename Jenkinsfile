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
        stage('up') {
            steps {
                slackUploadFile filePath: '**/trufflehog.txt, **/reports/*.html, **/trivy-*.txt, **/kubescape-*.txt', initialComment: 'Here'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/trufflehog.txt, **/reports/*.html, **/trivy-*.txt, **/kubescape-*.txt'
        }
    }
}
