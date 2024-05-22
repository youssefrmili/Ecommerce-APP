def microservices = ['ecomm-cart', 'ecomm-order', 'ecomm-product', 'ecomm-web']
def frontEndService = 'ecomm-ui'

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
        SSH_CREDENTIALS_ID = 'kubernetes-id'
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
                sh 'cat trufflehog.txt' // Output the results
            }
        }

        stage('Source Composition Analysis') {
            when {
                expression { (env.BRANCH_NAME == 'dev') || (env.BRANCH_NAME == 'test') || (env.BRANCH_NAME == 'master') }
            }
            steps {
                script {
                    def services = microservices + frontEndService
                    for (def service in services) {
                        dir(service) {
                            def reportFile = "dependency-check-report-${service}.html"
                            if (service == frontEndService) {
                                sh 'rm -f owasp-dependency-check-front.sh'
                                sh 'wget "https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/owasp-dependency-check-front.sh"'
                                sh 'chmod +x owasp-dependency-check-front.sh'
                                sh "./owasp-dependency-check-front.sh"
                            } else {
                                sh 'rm -f owasp-dependency-check.sh'
                                sh 'wget "https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/owasp-dependency-check.sh"'
                                sh 'chmod +x owasp-dependency-check.sh'
                                sh "./owasp-dependency-check.sh"
                            }
                            sh "mv /var/lib/jenkins/OWASP-Dependency-Check/reports/dependency-check-report.html /var/lib/jenkins/OWASP-Dependency-Check/reports/${reportFile}"
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
                def services = microservices + frontEndService
                for (def service in services) {
                    dir(service) {
                        withSonarQubeEnv('sonarqube') {
                            sh 'mvn clean package sonar:sonar'
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
                    def services = microservices + frontEndService
                    for (def service in services) {
                        dir(service) {
                            if (env.BRANCH_NAME == 'test') {
                                if (service == frontEndService) {
                                    sh 'rm -f Dockerfile'
                                    sh 'wget https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/ecomm-ui/Dockerfile.dev -O Dockerfile'
                                    sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_test:latest -f Dockerfile ."
                                } else {
                                    sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_test:latest ."
                                }
                            } else if (env.BRANCH_NAME == 'master') {
                                if (service == frontEndService) {
                                    sh 'rm -f Dockerfile'
                                    sh 'wget https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/ecomm-ui/Dockerfile.dev -O Dockerfile'
                                    sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_prod:latest -f Dockerfile ."
                                } else {
                                    sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_prod:latest ."
                                }
                            } else if (env.BRANCH_NAME == 'dev') {
                                if (service == frontEndService) {
                                    sh 'rm -f Dockerfile'
                                    sh 'wget https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/ecomm-ui/Dockerfile.dev -O Dockerfile'
                                    sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_dev:latest -f Dockerfile ."
                                } else {
                                    sh "docker build -t ${DOCKERHUB_USERNAME}/${service}_dev:latest ."
                                }
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
                    def services = microservices + frontEndService
                    for (def service in services) {
                        def trivyReportFile = "trivy-${service}.txt"
                        if (env.BRANCH_NAME == 'test') {
                            sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock  -v $PWD:/tmp/.cache/ aquasec/trivy image --security-checks vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_test:latest > ${trivyReportFile}"
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock  -v $PWD:/tmp/.cache/ aquasec/trivy image --security-checks vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_prod:latest > ${trivyReportFile}"
                        } else if (env.BRANCH_NAME == 'dev') {
                            sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock  -v $PWD:/tmp/.cache/ aquasec/trivy image --security-checks vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_dev:latest > ${trivyReportFile}"
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
                    def services = microservices + frontEndService
                    for (def service in services) {
                        if (env.BRANCH_NAME == 'test') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_test:latest"
                            sh "docker rmi ${DOCKERHUB_USERNAME}/${service}_test:latest"
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_prod:latest"
                            sh "docker rmi ${DOCKERHUB_USERNAME}/${service}_prod:latest"
                        } else if (env.BRANCH_NAME == 'dev') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_dev:latest"
                            sh "docker rmi ${DOCKERHUB_USERNAME}/${service}_dev:latest"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/trufflehog.txt, /var/lib/jenkins/OWASP-Dependency-Check/reports/*.html, **/trivy-*.txt'
            emailext attachLog: true,
                subject: "'${currentBuild.result}'",
                body: "Project: ${env.JOB_NAME}<br/>" +
                      "Build Number: ${env.BUILD_NUMBER}<br/>" +
                      "URL: ${env.BUILD_URL}<br/>" +
                      "Result: ${currentBuild.result}"
        }
    }
}
