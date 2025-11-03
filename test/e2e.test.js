// const { Builder, By, until } = require('selenium-webdriver');
// const { assert } = require('chai');

// // Important: Using Chrome for testing. Ensure ChromeDriver is accessible by Jenkins PATH.
// // On Windows, the simplest way is to ensure a browser (Chrome/Edge) is installed
// // and that the default WebDriverManager (used by recent Selenium versions) can find it.
// let driver = new Builder().forBrowser('chrome').build();

// // Use a self-invoking function for async testing with Mocha
// (async function runTests() {
//   try {
//     console.log('Starting Selenium E2E Test...');

//     // 1. Navigate to the running React application (default port 3000)
//     await driver.get('http://localhost:3000'); 
    
//     // 2. Wait for the main 'Learn React' link to appear (a proxy for page load)
//     await driver.wait(
//       until.elementLocated(By.className('App-link')),
//       10000 
//     );
    
//     console.log('Successfully loaded React application.');

//     // --- TEST CASE 1: Validate Welcome Text ---
//     const learnLink = await driver.findElement(By.className('App-link'));
//     const linkText = await learnLink.getText();

//     assert.equal(linkText, 'Learn React', 'Test Case 1 Failed: The link text did not match the expected "Learn React"');

//     // --- TEST CASE 2: Validate Href Attribute ---
//     const href = await learnLink.getAttribute('href');
//     assert.include(href, 'reactjs.org', 'Test Case 2 Failed: The link should point to reactjs.org');

//     console.log('All Selenium tests passed successfully!');

//   } catch (error) {
//     console.error('An error occurred during testing:', error);
//     // If the driver failed or a test assertion failed, fail the build
//     assert.fail(error.message);
//   } finally {
//     // 3. Cleanup: Always quit the driver
//     await driver.quit();
//   }
// })();


const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { assert } = require('chai');

// Configure Chrome options for Headless Execution
let options = new chrome.Options();
// CRITICAL: Tells Chrome to run without a GUI, necessary for CI/Jenkins services
options.addArguments('--headless'); 
// Recommended flags for CI environments
options.addArguments('--disable-gpu'); 
options.addArguments('--no-sandbox'); 
options.addArguments('--window-size=1920,1080'); // Set a reasonable viewport size

// Build the WebDriver with the headless options
let driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Use a self-invoking function for async testing with Mocha
(async function runTests() {
  try {
    console.log('Starting Selenium E2E Test...');

    // 1. Navigate to the running React application (default port 3000)
    await driver.get('http://localhost:3000'); 
    
    // 2. Wait for the main 'Learn React' link to appear (a proxy for page load)
    await driver.wait(
      until.elementLocated(By.className('App-link')),
      10000 
    );
    
    console.log('Successfully loaded React application in Headless Chrome.');

    // --- TEST CASE 1: Validate Welcome Text ---
    const learnLink = await driver.findElement(By.className('App-link'));
    const linkText = await learnLink.getText();

    assert.equal(linkText, 'Learn React', 'Test Case 1 Failed: The link text did not match the expected "Learn React"');

    // --- TEST CASE 2: Validate Href Attribute ---
    const href = await learnLink.getAttribute('href');
    assert.include(href, 'reactjs.org', 'Test Case 2 Failed: The link should point to reactjs.org');

    console.log('All Selenium tests passed successfully!');

  } catch (error) {
    console.error('An error occurred during testing:', error);
    // If the driver failed or a test assertion failed, fail the build
    assert.fail(error.message);
  } finally {
    // 3. Cleanup: Always quit the driver
    await driver.quit();
  }
})();
