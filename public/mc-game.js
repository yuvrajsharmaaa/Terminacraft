// Game state
let gameState = {
    isAlive: true,
    lastAction: null
};

// Steve's sassy responses
const sassyResponses = [
    "Oh look, another noob trying to play Minecraft...",
    "Did your mom help you type that?",
    "Even a zombie has better coordination than you!",
    "I've seen better players in creative mode...",
    "Are you sure you want to do that? Your last brain cell might disagree.",
    "Wow, that's the best you can come up with?",
    "I've seen creepers with better ideas than that.",
    "Maybe try something that doesn't make me facepalm?",
    "I'm not your personal assistant, you know...",
    "That's it? That's your grand plan?",
    "I've seen better ideas in a dirt house.",
    "Not even a zombie would do that.",
    "Are you trying to speedrun being bad at Minecraft?",
    "I've seen better strategies from a baby zombie.",
    "That's so bad, even a skeleton would facepalm."
];

// Random game events
const gameEvents = [
    "A creeper just exploded nearby! *BOOM*",
    "Found a diamond! Oh wait, it's just coal...",
    "Zombie horde incoming! Better run!",
    "Oof, fell into lava. That's gotta hurt.",
    "Skeleton just shot you in the back!",
    "Found a village! Too bad it's abandoned...",
    "Ender Dragon spotted in the distance!",
    "Mining some obsidian... with a wooden pickaxe?",
    "Trying to sleep in the Nether? Good luck with that!",
    "Building a dirt house? How original...",
    "Fell from a high place. Gravity is a harsh mistress.",
    "Suffocated in a wall. Smooth move, Einstein!",
    "Trying to fight the Wither with a wooden sword?",
    "Found an ancient city! Too bad you're not ready for it.",
    "Attempting to ride a pig? That's a new one...",
    "Dug straight down? Classic noob move.",
    "Trying to swim in lava? Bold strategy.",
    "Fighting a creeper with your fists? Good luck!",
    "Building with dirt? How original...",
    "Mining at night? Living dangerously, I see."
];

// Greeting patterns
const greetingPatterns = [
    /^hi\b/i,
    /^hello\b/i,
    /^hey\b/i,
    /^sup\b/i,
    /^yo\b/i,
    /^greetings\b/i,
    /^hola\b/i,
    /^bonjour\b/i,
    /^namaste\b/i,
    /^konnichiwa\b/i,
    /^ciao\b/i,
    /^guten tag\b/i,
    /^привет\b/i,
    /^你好\b/i,
    /^안녕\b/i
];

function getRandomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function isGreeting(text) {
    return greetingPatterns.some(pattern => pattern.test(text));
}

function getSteveResponse(input) {
    // Special responses for greetings
    if (isGreeting(input)) {
        return "Fuck off and tell me what to do!";
    }

    // Special response for help
    if (input.toLowerCase().includes('help')) {
        return "Help? You need help? Fine... Just type whatever you want, and I'll respond with my usual sass and some random Minecraft events. Happy now?";
    }

    // For everything else, generate a random response
    let response = "";
    
    // 80% chance of a sassy response
    if (Math.random() < 0.8) {
        response += getRandomResponse(sassyResponses);
    }
    
    // 70% chance of a game event
    if (Math.random() < 0.7) {
        if (response) response += "\n";
        response += getRandomResponse(gameEvents);
    }

    // If we somehow got no response, give a default sassy one
    if (!response) {
        response = "Wow, even I'm speechless at how bad that was.";
    }

    return response;
}

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById("terminal");
    const input = document.getElementById("command-input");

    input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            const cmd = input.value;
            terminal.innerHTML += `<div class="command">$ ${cmd}</div>`;
            input.value = "";

            const reply = getSteveResponse(cmd);
            const responseDiv = document.createElement('div');
            responseDiv.className = 'response';
            if (reply.includes('died') || reply.includes('exploded') || reply.includes('hurt')) {
                responseDiv.classList.add('death');
            }
            responseDiv.textContent = reply;
            terminal.appendChild(responseDiv);

            terminal.scrollTop = terminal.scrollHeight;
        }
    });

    // Focus input on click anywhere in terminal
    terminal.addEventListener('click', () => {
        input.focus();
    });

    // Initial focus
    input.focus();
});