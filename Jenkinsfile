def microservices = ['ecomm-cart']

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
        // Make sure DOCKER_PASSWORD is securely stored in Jenkins credentials and available for use
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository from GitHub
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: env.BRANCH_NAME]], // Checkout the current branch
                    userRemoteConfigs: [[url: 'https://github.com/youssefrmili/Ecommerce-APP.git']]
                ])
            }
        }

        stage('Check Git Secrets') {
            steps {
                script {
                    for (def service in microservices) {
                        dir(service) {
                            // Run TruffleHog to check for secrets in the repository
                            sh 'docker run --rm gesellix/trufflehog --json https://github.com/youssefrmili/Ecommerce-APP.git > trufflehog.json'
                            sh 'cat trufflehog.json' // Output the results
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
                            // Fetch OWASP dependency check script, give permissions, and execute
                            sh 'rm -f owasp-dependency-check.sh'
                            sh 'wget "https://raw.githubusercontent.com/youssefrmili/Ecommerce-APP/test/owasp-dependency-check.sh"'
                            sh 'chmod +x owasp-dependency-check.sh'
                            sh './owasp-dependency-check.sh'
                            // Output the analysis report for visibility
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
                            // Build the microservice using Maven
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
                            // Run unit tests using Maven
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
                                // Perform static analysis with SonarQube
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
                    // Log into Docker Hub using credentials stored in Jenkins
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
                            // Build the Docker image based on branch
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
                        // Use Trivy to scan the Docker images for vulnerabilities
                        if (env.BRANCH_NAME == 'test') {
                            sh "docker run --rm -v /home/youssef/.cache:/root/.cache/ aquasec/trivy image --scanners vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_test:latest > trivy.txt"
                        } else if (env.BRANCH_NAME == 'master') {
                            sh "docker run --rm -v /home/youssef/.cache:/root/.cache/ aquasec/trivy image --scanners vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_prod:latest > trivy.txt"
                        } else if (env.BRANCH_NAME == 'dev') {
                            sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $PWD:/tmp/.cache/ aquasec/trivy image --scanners vuln --timeout 30m ${DOCKERHUB_USERNAME}/${service}_dev:latest > trivy.txt"
                        }
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    for (def service in microservices) {
                        // Push the Docker images to Docker Hub based on branch
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

