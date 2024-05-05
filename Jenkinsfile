def microservices = ['ecomm-cart'] // Add more services as needed

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
        // Define the Docker tag based on branch name
        DOCKER_TAG = calculateDockerTag(env.BRANCH_NAME)
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

        stage('Check-Git-Secrets') {
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            sh 'rm -f trufflehog'
                            sh 'docker run --rm gesellix/trufflehog --json https://github.com/youssefrmili/Ecommerce-APP.git > trufflehog'
                            sh 'cat trufflehog'
                        }
                    }
                }
            }
        }

        stage('Source Composition Analysis') {
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            sh 'rm -f owasp*'
                            sh 'wget "https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/owasp-dependency-check.sh"'
                            sh 'chmod +x owasp-dependency-check.sh'
                            sh './owasp-dependency-check.sh'
                            sh 'cat /var/lib/jenkins/OWASP-Dependency-Check/reports/dependency-check-report.xml'
                        }
                    }
                }
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

        stage('Unit Test') {
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
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            withSonarQubeEnv(credentialsId: 'sonarqube-id') {
                                sh 'mvn sonar:sonar'
                            }
                        }
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    // Docker login using credentials
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            sh "docker build -t ${DOCKER_TAG} ."
                        }
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                script {
                    for (def service in microservices) {
                        sh "docker run --rm -v /home/youssef/.cache:/root/.cache/ aquasec/trivy image --scanners vuln --timeout 30m ${DOCKER_TAG} > trivy.txt"
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    for (def service in microservices) {
                        sh "docker push ${DOCKER_TAG}"
                    }
                }
            }
        }
    }

    // Define a function to calculate the Docker tag based on branch name
    def calculateDockerTag(branchName) {
        if (branchName == 'test') {
            return "${DOCKERHUB_USERNAME}/${service}_test:latest"
        } else if (branchName == 'master') {
            return "${DOCKERHUB_USERNAME}/${service}_prod:latest"
        } else if (branchName == 'dev') {
            return "${DOCKERHUB_USERNAME}/${service}_dev:latest"
        } else {
            error("Unsupported branch name: $branchName")
        }
    }
}
