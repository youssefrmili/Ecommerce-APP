def microservices = ['ecomm-web']
def frontEndService = 'ecomm-ui'

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
        SSH_CREDENTIALS_ID = 'kub-ssh-id'
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

        stage('Build') {
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            sh 'mvn clean install'
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    script {
                        if (env.BRANCH_NAME == 'test') {
                            sh "sudo ssh $MASTER_NODE kubectl apply -f test_deployments/namespace.yml"
                            sh "sudo ssh $MASTER_NODE kubectl apply -f test_deployments/infrastructure/"
                            for (def service in microservices) {
                                sh "sudo ssh $MASTER_NODE kubectl apply -f test_deployments/microservices/${service}.yml"
                            }
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "ssh $MASTER_NODE kubectl apply -f prod_deployments/namespace.yml"
                            sh "ssh $MASTER_NODE kubectl apply -f prod_deployments/infrastructure/"
                            for (def service in microservices) {
                                sh "ssh $MASTER_NODE kubectl apply -f prod_deployments/microservices/${service}.yml"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/trufflehog.txt, **/reports/*.html, **/trivy-*.txt'
            emailext attachLog: true,
                subject: "'${currentBuild.result}'",
                body: "Project: ${env.JOB_NAME}<br/>" +
                      "Build Number: ${env.BUILD_NUMBER}<br/>" +
                      "URL: ${env.BUILD_URL}<br/>" +
                      "Result: ${currentBuild.result}",
                to: 'yousseff.rmili@gmail.com',  // Change to your email address
                attachmentsPattern: '**/trivy-*.txt, **/reports/*.html, **/trufflehog.txt'
        }
    }
}
