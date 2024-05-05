def microservices = ['ecomm-cart']

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "youssefrm"
        // Ensure Docker credentials are stored securely in Jenkins
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
                expression { !env.BRANCH_NAME=='feature/*') }
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
