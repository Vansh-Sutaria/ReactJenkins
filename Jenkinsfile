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
                
                // 3. Keep the absolute path fix which correctly formats the path string for Node/Mocha
                // Output: mochaFile=C:/.../report.xml
                bat "npm run test -- --timeout 15000 --reporter mocha-junit-reporter --reporter-options mochaFile=${WORKSPACE.replaceAll('\\\\', '/')}/${REPORT_PATH}"
            }
            failFast true 
        }

        stage('Publish Results') {
            steps {
                echo 'Publishing Mocha Test Results...'
                // CRITICAL FIX: Use a glob pattern (**) to search the entire workspace recursively for the report.xml file.
                // This accounts for the possibility that the file is being written to a subdirectory 
                // (like 'test/' or 'my-react-app/test/') instead of the root workspace.
                junit '**/report.xml'
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
