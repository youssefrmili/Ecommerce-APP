def microservices = ['ecomm-cart']

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: env.BRANCH_NAME]], // Check out the current branch
                    userRemoteConfigs: [[url: 'https://github.com/youssefrmili/Ecommerce-APP.git']]
                ])
            }
        }

        stage('Check-Git-Secrets') {
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            sh 'rm -f trufflehog' // Ensure trufflehog file is removed
                            sh 'docker run --rm gesellix/trufflehog --json https://github.com/youssefrmili/Ecommerce-APP.git > trufflehog'
                            sh 'cat trufflehog' // Display the results
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
                            // Fetch the script, give execute permissions, and execute
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
                            sh 'mvn clean install' // Build the microservice
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
                            sh 'mvn test' // Run tests
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
                                sh 'docker start sonarqube'
                                sh 'mvn sonar:sonar' // Execute SAST with SonarQube
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
                            // Determine the appropriate Docker tag based on branch name
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
            steps {
                script {
                    for (def service in microservices) {
                        // Run Trivy image scan and save output to trivy.txt
                        sh "docker run --rm -v /home/youssef/.cache:/root/.cache/ aquasec/trivy image --scanners vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_prod:latest > trivy.txt"
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    for (def service in microservices) {
                        // Push the appropriate Docker image to DockerHub
                        if (env.BRANCH_NAME == 'test') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_test:latest"
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_prod:latest"
                        } else if (env.BRANCH_NAME == 'dev') {
                            sh "docker push ${DOCKERHUB_USERNAME}/${service}_dev:latest"
                        }
                    }
                }
            }
        }
    }
}
