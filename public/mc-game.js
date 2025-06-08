// Import SteveLogic
import SteveLogic from './steve-logic.js';

// Initialize game state
let gameState = {
    commandHistory: [],
    historyIndex: -1,
    isProcessing: false
};

// Initialize Steve's logic
const steve = new SteveLogic();

// Terminal setup
document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const commandInput = document.getElementById('command-input');

    if (!terminal || !commandInput) {
        console.error('Terminal elements not found!');
        return;
    }

    // Focus input on page load
    commandInput.focus();

    // Handle command input
    commandInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                // Add command to history
                gameState.commandHistory.push(command);
                gameState.historyIndex = gameState.commandHistory.length;

                // Display command
                const commandLine = document.createElement('div');
                commandLine.className = 'command-line';
                commandLine.innerHTML = `<span class="prompt">$</span> ${command}`;
                terminal.appendChild(commandLine);

                // Clear input
                commandInput.value = '';

                // Process command
                if (!gameState.isProcessing) {
                    gameState.isProcessing = true;
                    try {
                        const response = await steve.process_command(command);
                        
                        // Display response with typing effect
                        const responseLine = document.createElement('div');
                        responseLine.className = 'response-line';
                        terminal.appendChild(responseLine);
                        
                        // Add visual effect
                        responseLine.classList.add('typing');
                        
                        // Play sound effect
                        const soundEffect = new Audio('/sounds/click.mp3');
                        soundEffect.play().catch(() => {}); // Ignore autoplay errors
                        
                        // Type out response
                        let i = 0;
                        const typeResponse = () => {
                            if (i < response.length) {
                                responseLine.textContent += response[i];
                                i++;
                                setTimeout(typeResponse, 50);
                            } else {
                                responseLine.classList.remove('typing');
                                gameState.isProcessing = false;
                            }
                        };
                        typeResponse();
                    } catch (error) {
                        console.error('Error processing command:', error);
                        const errorLine = document.createElement('div');
                        errorLine.className = 'error-line';
                        errorLine.textContent = 'Error: ' + error.message;
                        terminal.appendChild(errorLine);
                        gameState.isProcessing = false;
                    }
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (gameState.historyIndex > 0) {
                gameState.historyIndex--;
                commandInput.value = gameState.commandHistory[gameState.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (gameState.historyIndex < gameState.commandHistory.length - 1) {
                gameState.historyIndex++;
                commandInput.value = gameState.commandHistory[gameState.historyIndex];
            } else {
                gameState.historyIndex = gameState.commandHistory.length;
                commandInput.value = '';
            }
        }
    });

    // Keep input focused
    terminal.addEventListener('click', () => {
        commandInput.focus();
    });

    // Add sound effects
    const sounds = {
        command: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'),
        error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-error-alert-2574.mp3'),
        success: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3')
    };

    // Play sound effect
    function playSound(type) {
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play();
        }
    }

    // Add visual effects
    function addVisualEffect(type) {
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.pointerEvents = 'none';
        effect.style.transition = 'all 0.5s ease-out';
        
        switch (type) {
            case 'glitch':
                effect.style.backgroundColor = '#ff0000';
                effect.style.opacity = '0.2';
                effect.style.width = '100%';
                effect.style.height = '100%';
                effect.style.top = '0';
                effect.style.left = '0';
                effect.style.animation = 'glitch 0.5s ease-out';
                break;
            case 'success':
                effect.style.backgroundColor = '#00ff00';
                effect.style.opacity = '0.2';
                effect.style.width = '100%';
                effect.style.height = '100%';
                effect.style.top = '0';
                effect.style.left = '0';
                effect.style.animation = 'success 0.5s ease-out';
                break;
        }
        
        terminal.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-5px, 5px); }
            40% { transform: translate(-5px, -5px); }
            60% { transform: translate(5px, 5px); }
            80% { transform: translate(5px, -5px); }
            100% { transform: translate(0); }
        }
        
        @keyframes success {
            0% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.1); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});