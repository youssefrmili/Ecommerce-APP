def microservices = ['ecomm-cart'] // Declare microservices list

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = credentials('dockerhub-username') // Use credentials plugin for secure storage
        DOCKERHUB_PASSWORD = credentials('dockerhub-password') // Include password for Docker authentication
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

        stage('Build') {
            when {
                expression { env.BRANCH_NAME!=('feature/*') } // Check if branch is not a feature branch
            }
            steps {
                script {
                    // Build each microservice using Maven
                    for (def service in microservices) {
                        dir(service) {
                            sh 'mvn clean install'
                        }
                    }
                }
            }
        }
    }
}
