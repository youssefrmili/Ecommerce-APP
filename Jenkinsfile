def microservices = ['ecomm-cart','ecomm-order','ecomm-product','ecomm-web']
def frontendservice = ['ecomm-front']
def services = microservices + frontendservice
def deployenv = ''
if (env.BRANCH_NAME == 'test') {
    deployenv = 'test'
} else if (env.BRANCH_NAME == 'master') {
    deployenv = 'prod'
}

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
         
        stage('Build') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
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

        stage('Kube-bench Scan') {
            when {
                expression { (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh "ssh $MASTER_NODE rm -f kubebench_CIS_${env.BRANCH_NAME}.txt"
                    sh "ssh $MASTER_NODE 'kube-bench > kubebench_CIS_${env.BRANCH_NAME}.txt'"
                    sh "scp $MASTER_NODE:~/kubebench_CIS_${env.BRANCH_NAME}.txt /var/lib/jenkins/workspace/**/kubebench_CIS_${env.BRANCH_NAME}.txt"
                }
            }
        }

        stage('Send reports to Slack') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                slackUploadFile filePath: '**/kubebench*',  initialComment: 'Check TruffleHog Reports!!'
            }
        }
    }
    post {
        always {
            script { 
                if ((env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master'))
            archiveArtifacts artifacts: '**/kubebench*.txt'
            }
        }
    }
}
