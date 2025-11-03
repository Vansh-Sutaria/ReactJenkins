pipeline {
    agent any
    
    environment {
        // Defines a specific, unique subdirectory for the report
        REPORT_PATH = 'test-results/report.xml'
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
                
                // CRITICAL: Create the output directory to guarantee a known file location
                echo "Creating report directory: test-results"
                bat 'mkdir test-results' 
                
                // 1. Start the React App in the background
                bat 'start /B npm start' 
                
                // 2. Use 'ping' to reliably wait for 15 seconds for server startup
                echo 'Waiting 15 seconds for React Dev Server to fully start...'
                bat 'ping 127.0.0.1 -n 15 > nul'
                
                // 3. Use the explicit relative path via the REPORT_PATH variable. 
                bat "npm run test -- --timeout 15000 --reporter mocha-junit-reporter --reporter-options mochaFile=${REPORT_PATH}"
                
                // 4. Synchronization Fix: Add a short delay to ensure the file system flushes the report.xml completely.
                echo 'Pausing 5 seconds to allow report.xml to fully flush to disk...'
                bat 'ping 127.0.0.1 -n 5 > nul'
            }
            failFast true 
        }

        stage('Publish Results') {
            steps {
                echo "Publishing Mocha Test Results from: ${REPORT_PATH}..."
                // Now, use the explicit path, which is relative to the workspace root.
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
