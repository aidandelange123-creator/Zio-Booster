#!/usr/bin/env node

/**
 * Post-install script for Zio Booster NPM package
 * This runs after npm install to ensure everything is set up correctly
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PLATFORM = os.platform();

console.log('');
console.log('='.repeat(60));
console.log('  🎉 Zio Booster Post-Installation Setup');
console.log('='.repeat(60));
console.log('');

/**
 * Make index.js executable on Unix systems
 */
function makeExecutable() {
    return new Promise((resolve) => {
        if (PLATFORM === 'win32') {
            console.log('✓ Windows: No chmod needed');
            resolve();
            return;
        }
        
        const indexPath = path.join(__dirname, 'index.js');
        
        exec(`chmod +x "${indexPath}"`, (error) => {
            if (error) {
                console.log('⚠️  Could not make index.js executable (this is usually okay)');
            } else {
                console.log('✓ Made index.js executable');
            }
            resolve();
        });
    });
}

/**
 * Check Python installation
 */
function checkPython() {
    return new Promise((resolve) => {
        const pythonCommand = PLATFORM === 'win32' ? 'python --version' : 'python3 --version';
        
        exec(pythonCommand, (error, stdout, stderr) => {
            if (error || !stdout.trim()) {
                console.log('⚠️  Python not found in PATH');
                console.log('   Please install Python 3.7+ from https://www.python.org/downloads/');
                resolve(false);
            } else {
                console.log(`✓ Python detected: ${stdout.trim()}`);
                resolve(true);
            }
        });
    });
}

/**
 * Install Python dependencies
 */
function installPythonDeps() {
    return new Promise((resolve) => {
        const requirementsPath = path.join(__dirname, 'requirements.txt');
        
        if (!fs.existsSync(requirementsPath)) {
            console.log('⚠️  requirements.txt not found, skipping Python dependencies');
            resolve();
            return;
        }
        
        console.log('');
        console.log('📦 Installing Python dependencies...');
        
        const pipCommand = PLATFORM === 'win32' 
            ? 'pip install -r requirements.txt' 
            : 'pip3 install -r requirements.txt';
        
        exec(pipCommand, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.log('⚠️  Some Python dependencies may have failed to install');
                console.log('   You can install them manually with: pip install psutil customtkinter');
            } else {
                console.log('✓ Python dependencies installed successfully');
            }
            resolve();
        });
    });
}

/**
 * Display usage instructions
 */
function showUsage() {
    console.log('');
    console.log('='.repeat(60));
    console.log('  ✅ Installation Complete!');
    console.log('='.repeat(60));
    console.log('');
    console.log('You can now use Zio Booster:');
    console.log('');
    
    if (PLATFORM === 'win32') {
        console.log('  On Windows:');
        console.log('    npx zio              # Run Zio Booster');
        console.log('    npm install -g zio   # Install globally, then run:');
        console.log('    zio                  # Launch Zio Booster');
    } else {
        console.log('  On macOS/Linux:');
        console.log('    npx zio              # Run Zio Booster');
        console.log('    npm install -g zio   # Install globally, then run:');
        console.log('    zio                  # Launch Zio Booster');
    }
    
    console.log('');
    console.log('Features:');
    console.log('  ✓ Auto-installs Git if not present');
    console.log('  ✓ FPS boosting and system optimization');
    console.log('  ✓ Real-time monitoring (CPU, Memory, Temperature)');
    console.log('  ✓ Game profile management');
    console.log('  ✓ Video Browser API with branded watermarks');
    console.log('');
    console.log('For more information, visit:');
    console.log('  https://github.com/aidandelange123-oss/Zio-Booster');
    console.log('');
}

/**
 * Main execution
 */
async function main() {
    await makeExecutable();
    const hasPython = await checkPython();
    
    if (hasPython) {
        await installPythonDeps();
    }
    
    showUsage();
}

main().catch(console.error);
