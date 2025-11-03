// pipeline {
//     agent any
    
//     environment {
//         // Specify the Node version you configured in Jenkins Global Tool Configuration
//         NODE_VERSION = '18'
//         REPORT_PATH = 'report.xml'
//     }

//     tools {
//         // Use the name you configured in Jenkins (e.g., 'NODE_18' or 'NODE_VERSION')
//         nodejs "NodeJS"
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 echo 'Checking out code from Git...'
//                 checkout scm
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 echo 'Installing Node dependencies...'
//                 // Use the Node.js installation configured in the 'tools' block
//                 bat 'npm install'
//             }
//         }

//         stage('Run E2E Tests') {
//             steps {
//                 echo 'Starting React app in background and running E2E tests...'
                
//                 // CRITICAL WINDOWS FIX: Use 'start /B' to run the React app in the background
//                 // We use two separate bat commands to ensure the first one launches the background process
//                 bat 'start /B npm start' 
                
//                 echo 'Waiting 15 seconds for React Dev Server to fully start...'
//                 // Wait for the React app to initialize and become reachable on port 3000
//                 bat 'timeout /t 15 /nobreak' 
                
//                 // Run the E2E Tests using the npm script which calls Mocha
//                 bat 'npm test' 
//             }
//         }

//         stage('Publish Results') {
//             steps {
//                 echo 'Publishing Mocha Test Results...'
//                 junit "${REPORT_PATH}"
//             }
//         }
//     }
    
//     post {
//         always {
//             script {
//                 echo 'Attempting to stop the background React server...'
//                 // CRITICAL WINDOWS FIX: Find and kill the process using port 3000
//                 // netstat finds the PID using port 3000, and taskkill forcibly terminates it.
//                 // The '|| true' equivalent in bat is usually 'exit /b 0' but in Groovy, we wrap the entire
//                 // kill process in a try/catch or just rely on the shell exit code being non-zero but not crashing the pipeline.
//                 bat """
//                     FOR /F "tokens=5" %%a IN ('netstat -ano ^| findstr :3000') DO (
//                         taskkill /PID %%a /F
//                     )
//                 """
//                 cleanWs()
//             }
//         }
//         success {
//             echo '✅ Pipeline finished successfully!'
//         }
//         failure {
//             echo '❌ Pipeline failed! Review logs and test reports.'
//         }
//     }
// }

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
                
                // 3. CRITICAL FIX: Run Mocha directly, passing all reporter options explicitly.
                // This ensures mocha-junit-reporter creates the report.xml file.
                bat "npm run test -- --timeout 15000 --reporter mocha-junit-reporter --reporter-options mochaFile=${REPORT_PATH}"
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

