#!/usr/bin/env node

/**
 * Zio Booster - Main Entry Point
 * Auto-installs Git if not present and launches Zio Booster
 */

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const PLATFORM = os.platform();
const WORKSPACE_DIR = __dirname;

console.log('='.repeat(60));
console.log('  🚀 Zio Booster - FPS Booster & System Optimizer');
console.log('='.repeat(60));
console.log('');

/**
 * Check if Git is installed
 */
function checkGitInstalled(callback) {
    const gitCommand = PLATFORM === 'win32' ? 'git --version' : 'which git';
    
    exec(gitCommand, (error, stdout, stderr) => {
        if (error || !stdout.trim()) {
            callback(false);
        } else {
            console.log('✓ Git is already installed');
            console.log(`  ${stdout.trim()}`);
            callback(true);
        }
    });
}

/**
 * Install Git based on platform
 */
function installGit(callback) {
    console.log('📦 Git not found. Installing Git...');
    console.log('');
    
    if (PLATFORM === 'win32') {
        // Windows: Use winget or chocolatey
        console.log('Attempting to install Git via winget...');
        exec('winget install --id Git.Git -e --source winget', (error) => {
            if (error) {
                console.log('Winget installation failed. Trying chocolatey...');
                exec('choco install git -y', (chocoError) => {
                    if (chocoError) {
                        console.error('❌ Failed to install Git automatically.');
                        console.error('Please install Git manually from: https://git-scm.com/download/win');
                        callback(false);
                    } else {
                        console.log('✓ Git installed successfully via Chocolatey');
                        callback(true);
                    }
                });
            } else {
                console.log('✓ Git installed successfully via winget');
                callback(true);
            }
        });
    } else if (PLATFORM === 'darwin') {
        // macOS: Use Homebrew
        console.log('Attempting to install Git via Homebrew...');
        exec('brew install git', (error) => {
            if (error) {
                console.error('❌ Failed to install Git via Homebrew.');
                console.error('Please install Git manually or install Homebrew first.');
                callback(false);
            } else {
                console.log('✓ Git installed successfully via Homebrew');
                callback(true);
            }
        });
    } else if (PLATFORM === 'linux') {
        // Linux: Try apt, yum, or pacman
        console.log('Attempting to install Git via package manager...');
        
        const linuxCommands = [
            'apt-get update && apt-get install -y git',
            'yum install -y git',
            'dnf install -y git',
            'pacman -S git'
        ];
        
        let commandIndex = 0;
        
        function tryNextCommand() {
            if (commandIndex >= linuxCommands.length) {
                console.error('❌ Failed to install Git automatically.');
                console.error('Please install Git manually using your distribution\'s package manager.');
                callback(false);
                return;
            }
            
            const cmd = linuxCommands[commandIndex];
            console.log(`Trying: ${cmd.split(' ').pop()}...`);
            
            exec(cmd, (error) => {
                if (error) {
                    commandIndex++;
                    tryNextCommand();
                } else {
                    console.log('✓ Git installed successfully');
                    callback(true);
                }
            });
        }
        
        tryNextCommand();
    } else {
        console.error(`❌ Unsupported platform: ${PLATFORM}`);
        callback(false);
    }
}

/**
 * Launch Zio Booster Python application
 */
function launchZioBooster() {
    console.log('');
    console.log('🎮 Launching Zio Booster...');
    console.log('');
    
    const pythonScript = path.join(WORKSPACE_DIR, 'start-application.py');
    
    if (!fs.existsSync(pythonScript)) {
        console.error('❌ Error: start-application.py not found!');
        console.error('Please ensure Zio Booster files are properly installed.');
        process.exit(1);
    }
    
    // Determine Python command
    const pythonCommand = PLATFORM === 'win32' ? 'python' : 'python3';
    
    const zioProcess = spawn(pythonCommand, [pythonScript, ...process.argv.slice(2)], {
        stdio: 'inherit',
        cwd: WORKSPACE_DIR
    });
    
    zioProcess.on('close', (code) => {
        console.log('');
        console.log(`Zio Booster exited with code ${code}`);
        process.exit(code);
    });
    
    zioProcess.on('error', (err) => {
        console.error('❌ Failed to start Zio Booster:', err.message);
        console.error('Make sure Python 3.7+ is installed and in PATH.');
        process.exit(1);
    });
}

/**
 * Main execution flow
 */
function main() {
    checkGitInstalled((isInstalled) => {
        if (isInstalled) {
            launchZioBooster();
        } else {
            installGit((installSuccess) => {
                if (installSuccess) {
                    console.log('');
                    console.log('Restarting Zio Booster with Git...');
                    console.log('');
                    setTimeout(launchZioBooster, 2000);
                } else {
                    console.log('');
                    console.log('⚠️  Continuing without Git (some features may be limited)...');
                    console.log('');
                    setTimeout(launchZioBooster, 1000);
                }
            });
        }
    });
}

// Run main function
main();
