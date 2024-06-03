def microservices = ['ecomm-cart','ecomm-order','ecomm-product','ecomm-user']
def frontendservice = 'ecomm-ui'
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

        stage('Check Git Secrets') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                sh 'docker run --rm -v "$PWD:/pwd" trufflesecurity/trufflehog:latest github --repo https://github.com/youssefrmili/Ecommerce-APP.git > trufflehog.txt'
            }
        }

        stage('Source Composition Analysis') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    for (def service in services) {
                        dir(service) {
                            def reportFile = "dependency-check-report-${service}.html"
                            if (service in microservices) {
                                sh 'rm -f owasp-dependency-check.sh'
                                sh 'wget "https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/owasp-dependency-check.sh"'
                                sh 'chmod +x owasp-dependency-check.sh'
                                sh "./owasp-dependency-check.sh"
                            } else if (service == frontendservice) { 
                                sh 'rm -f owasp-dependency-check-front.sh'
                                sh 'wget "https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/owasp-dependency-check-front.sh"'
                                sh 'chmod +x owasp-dependency-check-front.sh'
                                sh "./owasp-dependency-check-front.sh"
                            }
                            sh "mv /var/lib/jenkins/workspace/**/reports/dependency-check-report.html /var/lib/jenkins/workspace/**/reports/${reportFile}"
                        }
                    }
                }
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

        stage('Unit Test') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            sh 'mvn test'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                                withSonarQubeEnv('sonarqube') {
                                    sh 'mvn clean package sonar:sonar'
                            }
                        }
                    }
                }
            }
        }

        stage('Docker Login') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    }
                }
            }
        }

        stage('Docker Build') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    for (def service in services) {
                        dir(service) {
                            if (env.BRANCH_NAME == 'test') {
                                sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_test:latest ."
                            } else if (env.BRANCH_NAME == 'master') {
                                sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_prod:latest ."
                            } else if (env.BRANCH_NAME == 'dev') {
                                sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_dev:latest ."
                            }
                        }
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    for (def service in services) {
                        def trivyReportFile = "trivy-${service}.txt"
                        if (env.BRANCH_NAME == 'test') {
                            sh "sudo trivy --timeout 15m image ${DOCKERHUB_USERNAME}/${service}_test:latest > ${trivyReportFile}"                        
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "sudo trivy --timeout 15m image ${DOCKERHUB_USERNAME}/${service}_prod:latest > ${trivyReportFile}"                        
                        } else if (env.BRANCH_NAME == 'dev') {
                            sh "sudo trivy --timeout 15m image ${DOCKERHUB_USERNAME}/${service}_dev:latest > ${trivyReportFile}"                        
                        }
                    }
                }
            }
        }

        stage('Docker Push') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    for (def service in services) {
                        if (env.BRANCH_NAME == 'test') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_test:latest"
                            sh "docker rmi -f ${DOCKERHUB_USERNAME}/${service}_test:latest"
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_prod:latest"
                            sh "docker rmi -f ${DOCKERHUB_USERNAME}/${service}_prod:latest"
                        } else if (env.BRANCH_NAME == 'dev') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_dev:latest"
                            sh "docker rmi -f ${DOCKERHUB_USERNAME}/${service}_dev:latest"
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
                    sh "ssh $MASTER_NODE 'kube-bench > kubebench_CIS_${env.BRANCH_NAME}.txt'"
                }
            }
        }

        stage('Kubescope Scan') {
            when {
                expression { (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh "ssh $MASTER_NODE 'kubescape scan framework mitre > kubescape_mitre_${env.BRANCH_NAME}.txt'"
                }
            }
        }

        stage('Get YAML Files') {
            when {
                expression { (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh "rm -f deploy_to_${deployenv}.sh"
                        sh "wget \"https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/deploy_to_${deployenv}.sh\""
                        sh "scp deploy_to_${deployenv}.sh $MASTER_NODE:~"
                        sh "ssh $MASTER_NODE chmod +x deploy_to_${deployenv}.sh"
                        sh "ssh $MASTER_NODE ./deploy_to_${deployenv}.sh"
                    }
                }
            }
        }

        stage('Scan YAML Files') {
            when {
                expression { (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh "ssh $MASTER_NODE rm -f kubescape_infrastructure_${deployenv}.txt"
                        sh "ssh $MASTER_NODE rm -f kubescape_microservices_${deployenv}.txt"
                        sh "ssh $MASTER_NODE 'kubescape scan ${deployenv}_manifests/infrastructure/*.yml > kubescape_infrastructure_${deployenv}.txt'"
                        sh "ssh $MASTER_NODE 'kubescape scan ${deployenv}_manifests/microservices/*.yml > kubescape_microservices_${deployenv}.txt'"
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
                        sh "ssh $MASTER_NODE kubectl apply -f ${deployenv}_manifests/namespace.yml"
                        sh "ssh $MASTER_NODE kubectl apply -f ${deployenv}_manifests/infrastructure/"
                        for (service in services) {
                            sh "ssh $MASTER_NODE kubectl apply -f ${deployenv}_manifests/microservices/${service}.yml"
                        }
                    }
                }
            }
        }

        stage('Send reports to Slack') {
            steps {
                slackUploadFile filePath: '**/trufflehog.txt',  initialComment: 'Check TruffleHog Reports!!'
                slackUploadFile filePath: '**/reports/*.html', initialComment: 'Check ODC Reports!!'
                slackUploadFile filePath: '**/trivy-*.txt', initialComment: 'Check Trivy Reports!!'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/trufflehog.txt, **/reports/*.html, **/trivy-*.txt'
        }
    }
}
