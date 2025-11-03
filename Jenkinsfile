pipeline {
    agent any
    
    environment {
        // This is still needed to provide the filename to the junit step
        REPORT_PATH = 'report.xml'
    }

    tools {
        // Using the exact name 'NodeJS' that you configured
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
                
                // 3. CRITICAL FINAL FIX: Running Mocha with Windows-native environment variable expansion (%REPORT_PATH%)
                // The report file should now generate successfully in the root workspace directory.
                bat "npm run test -- --timeout 15000 --reporter mocha-junit-reporter --reporter-options mochaFile=%REPORT_PATH%"
            }
            failFast true 
        }

        stage('Publish Results') {
            steps {
                echo 'Publishing Mocha Test Results...'
                // This step will now find the report.xml file
                junit "${REPORT_PATH}"
            }
        }
    }
    
    post {
        always {
            script {
                echo 'Attempting to stop the background React server...'
                // Robust command to find and kill the process using port 3000
                // Note: The variable %%a is necessary for Windows Batch FOR loops within a Jenkins bat step.
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
