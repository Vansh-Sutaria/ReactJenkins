pipeline {
    agent any
    
    environment {
        // Defines the filename relative to the workspace
        REPORT_PATH = 'report.xml'
    }

    tools {
        nodejs 'NodeJS' 
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node dependencies...'
                bat 'npm install'
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo 'Starting React app in background and running E2E tests...'
                
                // 1. Start the React App in the background
                bat 'start /B npm start' 
                
                // 2. Use 'ping' to reliably wait for 15 seconds
                echo 'Waiting 15 seconds for React Dev Server to fully start...'
                bat 'ping 127.0.0.1 -n 15 > nul'
                
                // 3. CRITICAL FINAL FIX: Use the full $WORKSPACE path to ensure report.xml is created 
                // in the Jenkins workspace root, regardless of the shell's current working directory.
                // We use double quotes to allow Groovy to interpolate the ${...} variables.
                bat "npm run test -- --timeout 15000 --reporter mocha-junit-reporter --reporter-options mochaFile='${WORKSPACE}/${REPORT_PATH}'"
            }
            failFast true 
        }

        stage('Publish Results') {
            steps {
                echo 'Publishing Mocha Test Results...'
                // This step will now find the file at the expected location
                junit "${REPORT_PATH}"
            }
        }
    }
    
    post {
        always {
            script {
                echo 'Attempting to stop the background React server...'
                // Robust command to find and kill the process using port 3000
                bat 'for /f "tokens=5" %%a in (\'netstat -ano ^| findstr :3000\') do taskkill /PID %%a /F || true'
                cleanWs()
            }
        }
        success {
            echo '✅ Pipeline finished successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Review logs and test reports.'
        }
    }
}
