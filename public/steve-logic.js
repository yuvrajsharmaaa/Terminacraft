// Steve's character logic system
class SteveLogic {
    constructor() {
        this.moods = ["helpful", "mean", "sarcastic", "chaotic", "confused"];
        this.currentMood = this.moods[0];
        this.player = {
            x: 0,
            y: 0,
            z: 0,
            inventory: [],
            health: 20,
            hunger: 20,
            experience: 0,
            level: 0,
            gamemode: "survival",
            time: 0,
            weather: "clear",
            dimension: "overworld",
            effects: [],
            armor: {
                helmet: null,
                chestplate: null,
                leggings: null,
                boots: null
            },
            tools: {
                mainHand: null,
                offHand: null
            },
            // New village-related properties
            village: {
                name: "New Village",
                population: 0,
                happiness: 100,
                resources: {
                    food: 100,
                    wood: 100,
                    stone: 100
                }
            },
            family: {
                spouse: null,
                children: [],
                home: null
            },
            profession: null,
            reputation: 0
        };
        
        // Village professions
        this.professions = {
            farmer: {
                tasks: ["grow_crops", "harvest", "breed_animals"],
                skills: ["farming", "animal_husbandry"]
            },
            blacksmith: {
                tasks: ["craft_tools", "repair_items", "smelt_ores"],
                skills: ["smithing", "repairing"]
            },
            librarian: {
                tasks: ["trade_books", "enchant_items", "research"],
                skills: ["enchanting", "trading"]
            },
            builder: {
                tasks: ["build_houses", "repair_buildings", "design_structures"],
                skills: ["construction", "design"]
            },
            guard: {
                tasks: ["patrol_village", "defend_raids", "train_villagers"],
                skills: ["combat", "defense"]
            },
            mayor: {
                tasks: ["manage_resources", "organize_events", "make_decisions"],
                skills: ["leadership", "diplomacy"]
            }
        };

        // Cache for responses
        this.responseCache = new Map();
        
        // Pre-compute response templates
        this.templates = {
            "move": [
                "Moved {dir}. As exciting as watching paint dry.",
                "Walking {dir}. Must be exhausting on your leg muscles.",
                "Trudging {dir}? You're not hiking Everest, just grid coords."
            ],
            "inventory": [
                "You're carrying: {items}. Heavy stuff, huh?",
                "Inventory: {items}. Emotional baggage not included.",
                "You got {items}. Bet you wish you had diamond armor instead."
            ],
            "time": [
                "Time is now {t}. Your bedtime or party time?",
                "Set time to {t}. Because you control the sun. Cool, right?"
            ],
            "weather": [
                "Weather = {w}. Guess Steve's mood later.",
                "Changed weather to {w}. Hope your pixels like it."
            ],
            "give": [
                "Here's your {item}. Don't say I never gave you anything.",
                "Gave you {item}. Use it wisely... or don't."
            ],
            "gamemode": [
                "Changed to {mode}. Now you can {action}!",
                "Switched to {mode}. Time to {action}!"
            ],
            "village": [
                "Welcome to {name}! Population: {pop}, Happiness: {happy}%",
                "Your village {name} is thriving! Resources: {resources}"
            ],
            "marriage": [
                "Congratulations! You're now married to {spouse}!",
                "A new chapter begins with {spouse} by your side!"
            ],
            "adoption": [
                "Welcome {child} to your family!",
                "Your family grows with the adoption of {child}!"
            ],
            "profession": [
                "You are now a {prof}! Your skills: {skills}",
                "Welcome to your new role as {prof}! Tasks: {tasks}"
            ],
            "life_advice": [
                "Remember, {advice}",
                "Here's a thought: {advice}",
                "Let me share some wisdom: {advice}",
                "In life, {advice}",
                "Something to consider: {advice}"
            ],
            "random_thought": [
                "You know what's funny? {thought}",
                "Random thought: {thought}",
                "Did you ever think about {thought}?",
                "Here's something interesting: {thought}",
                "I was just thinking: {thought}"
            ],
            "motivation": [
                "Your next goal should be {goal}!",
                "Why not try {goal}?",
                "I think you'd enjoy {goal}",
                "How about {goal}?",
                "Maybe it's time to {goal}"
            ],
            "greeting": [
                "Well, well, well... look who decided to show up! {greeting}",
                "Oh great, another player to deal with. {greeting}",
                "If it isn't my favorite block-placer! {greeting}",
                "Look who's back from their mining expedition! {greeting}",
                "Oh, you're still alive? {greeting}",
                "Did you bring snacks? No? {greeting}",
                "Welcome back to the land of the living! {greeting}",
                "Oh, it's you again. {greeting}",
                "Look who's back from their adventure! {greeting}",
                "Well, if it isn't my favorite diamond hunter! {greeting}"
            ]
        };

        // Add life advice and random thoughts
        this.lifeAdvice = [
            "the best blocks are the ones you place with friends",
            "sometimes you need to mine deep to find diamonds",
            "every creeper is just a friend who hasn't exploded yet",
            "life is like crafting - you need the right ingredients",
            "don't judge a book by its enchantment",
            "the best adventures start with a single step",
            "even the strongest obsidian can be broken with persistence",
            "your inventory is like your life - keep what matters",
            "sometimes you need to fall to learn how to fly",
            "the best builds take time and patience"
        ];

        this.randomThoughts = [
            "what if creepers are just misunderstood",
            "why do villagers make that 'hmm' sound",
            "imagine if the sun was actually a giant torch",
            "what if the ender dragon is just a really big chicken",
            "why do we call it 'mine'craft when we're mostly building",
            "what if diamonds are just really shiny dirt",
            "imagine if zombies were just villagers who stayed up too late",
            "why do we need beds when we can just stand still",
            "what if the nether is just the overworld's spicy cousin",
            "why do we call it 'survival' when we're mostly thriving"
        ];

        this.motivations = [
            "exploring the deep dark",
            "building a castle in the sky",
            "starting a village of your own",
            "becoming a master farmer",
            "creating an automatic farm",
            "defeating the ender dragon",
            "collecting every type of block",
            "making friends with a wolf",
            "learning to fly with elytra",
            "becoming a master builder"
        ];

        // Add greeting variations
        this.greetings = [
            "How's the mining going? Found any diamonds or just more dirt?",
            "Hope you didn't get lost in the caves again!",
            "Did you remember to bring your pickaxe this time?",
            "Welcome to another day of block-breaking and mob-fighting!",
            "Ready to build something that won't look like a dirt house?",
            "Hope you're not here to ask for more torches...",
            "Did you bring your A-game or just your wooden sword?",
            "Welcome back to the world of方块!",
            "Hope you're ready for another day of pixelated adventures!",
            "Did you remember to feed your pet wolf this time?"
        ];

        // Add greeting triggers
        this.greetingTriggers = [
            "hi", "hello", "hey", "greetings", "sup", "yo", "hola", "bonjour",
            "good morning", "good afternoon", "good evening", "howdy",
            "what's up", "how are you", "how's it going", "greetings",
            "welcome", "hi there", "hello there", "hey there"
        ];
    }

    // Optimized response system
    get_mood_response(type, context) {
        const cacheKey = `${type}-${JSON.stringify(context)}-${this.currentMood}`;
        if (this.responseCache.has(cacheKey)) {
            return this.responseCache.get(cacheKey);
        }

        let response = "";
        if (this.templates[type]) {
            response = this.templates[type][Math.floor(Math.random() * this.templates[type].length)];
        } else {
            response = "Hmm... what are you trying to do?";
        }

        // Single pass string replacement
        response = response.replace(/\{(\w+)\}/g, (match, key) => {
            switch (key) {
                case 'dir': return context.direction || 'somewhere';
                case 'items': return context.inventory?.join(', ') || 'nothing';
                case 't': return this.player.time;
                case 'w': return this.player.weather;
                case 'item': return context.item || 'something';
                case 'mode': return context.mode || 'survival';
                case 'action': return context.action || 'play';
                case 'name': return context.name || 'Unknown';
                case 'pop': return context.pop || '0';
                case 'happy': return context.happy || '0';
                case 'resources': return context.resources || 'none';
                case 'spouse': return context.spouse || 'nobody';
                case 'child': return context.child || 'nobody';
                case 'prof': return context.prof || 'none';
                case 'skills': return context.skills || 'none';
                case 'tasks': return context.tasks || 'none';
                case 'greeting': return context.greeting || 'Hello!';
                case 'advice': return context.advice || 'something';
                case 'thought': return context.thought || 'nothing';
                case 'goal': return context.goal || 'something';
                default: return match;
            }
        });

        this.responseCache.set(cacheKey, response);
        return response;
    }

    async process_command(command) {
        const parts = command.toLowerCase().split(' ');
        const action = parts[0];
        const args = parts.slice(1);

        // Check for greetings first
        if (this.isGreeting(command)) {
            return this.get_greeting_response();
        }

        // Then check for game commands
        try {
            switch (action) {
                case 'help':
                    return this.handle_help();
                case 'move':
                    return this.handle_move(args[0]);
                case 'inventory':
                    return this.get_mood_response('inventory', { inventory: this.player.inventory });
                case 'time':
                    return this.handle_time(args[0]);
                case 'weather':
                    return this.handle_weather(args[0]);
                case 'give':
                    return this.handle_give(args[0]);
                case 'gamemode':
                    return this.handle_gamemode(args[0]);
                case 'village':
                    return this.handle_village(args[0]);
                case 'marry':
                    return this.handle_marriage(args[0]);
                case 'adopt':
                    return this.handle_adoption(args[0]);
                case 'profession':
                    return this.handle_profession(args[0]);
                case 'build':
                    return this.handle_building(args[0]);
                case 'trade':
                    return this.handle_trade(args[0], args[1]);
                default:
                    // If not a game command, give a random response
                    return this.get_random_response(command);
            }
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    get_random_response(input) {
        // 30% chance for life advice
        // 30% chance for random thought
        // 40% chance for motivation
        const roll = Math.random();
        
        if (roll < 0.3) {
            const advice = this.lifeAdvice[Math.floor(Math.random() * this.lifeAdvice.length)];
            return this.get_mood_response('life_advice', { advice });
        } else if (roll < 0.6) {
            const thought = this.randomThoughts[Math.floor(Math.random() * this.randomThoughts.length)];
            return this.get_mood_response('random_thought', { thought });
        } else {
            const goal = this.motivations[Math.floor(Math.random() * this.motivations.length)];
            return this.get_mood_response('motivation', { goal });
        }
    }

    handle_help() {
        return `Available commands:
- help: Show this help message
- move [direction]: Move in a direction (north, south, east, west)
- inventory: Check your inventory
- time [day/night]: Set the time
- weather [clear/rain/thunder]: Change the weather
- give [item]: Get an item
- gamemode [survival/creative]: Change game mode
- village [info/build/expand]: Manage your village
- marry [villager_name]: Propose marriage to a villager
- adopt [child_name]: Adopt a child
- profession [farmer/blacksmith/librarian/builder/guard/mayor]: Choose a profession
- build [house/shop/farm]: Build structures
- trade [villager_name] [item]: Trade with villagers`;
    }

    handle_move(direction) {
        const validDirections = ['north', 'south', 'east', 'west'];
        if (!validDirections.includes(direction)) {
            return "Invalid direction. Use north, south, east, or west.";
        }

        // Random event generator
        const events = [
            {
                type: 'death',
                msg: [
                    `You walk ${direction}. Oh no, a creeper appears! BOOM! You respawn at the start. RIP.`,
                    `You head ${direction} and fall into a pit of lava. Oops! Respawning...`,
                    `You bravely go ${direction}... and get ambushed by a horde of zombies. You died! Respawn time!`,
                    `You move ${direction}, but a skeleton snipes you from afar. Ouch! Respawning at spawn.`
                ]
            },
            {
                type: 'fun',
                msg: [
                    `You go ${direction} and trip over a chicken. The chicken stares at you in judgment.`,
                    `You walk ${direction} and find a mysterious block. It's... just dirt. Classic.`,
                    `You head ${direction} and step on a LEGO. The pain is real, but you survive.`,
                    `You move ${direction} and a wandering trader offers you a suspicious stew. You politely decline.`,
                    `You go ${direction} and find a sign: 'Herobrine was here.' Spooky!`,
                    `You walk ${direction} and a pig follows you. You have a new friend!`,
                    `You head ${direction} and see a sheep doing parkour. Impressive.`
                ]
            },
            {
                type: 'nothing',
                msg: [
                    `You walk ${direction}. Nothing interesting happens.`,
                    `You go ${direction}. The world is quiet... too quiet.`,
                    `You move ${direction}. Just more blocks.`,
                    `You head ${direction}. The adventure continues.`
                ]
            }
        ];

        // 20% chance of death, 50% fun, 30% nothing
        const roll = Math.random();
        let eventType;
        if (roll < 0.2) {
            eventType = 'death';
        } else if (roll < 0.7) {
            eventType = 'fun';
        } else {
            eventType = 'nothing';
        }
        const event = events.find(e => e.type === eventType);
        const message = event.msg[Math.floor(Math.random() * event.msg.length)];

        // If death, respawn player
        if (eventType === 'death') {
            this.player.x = 0;
            this.player.y = 0;
            this.player.z = 0;
            // Optionally clear inventory or add more chaos here
        } else {
            // Actually move the player
            switch (direction) {
                case 'north': this.player.z--; break;
                case 'south': this.player.z++; break;
                case 'east': this.player.x++; break;
                case 'west': this.player.x--; break;
            }
        }

        return message;
    }

    handle_time(time) {
        if (!['day', 'night'].includes(time)) {
            return "Invalid time. Use 'day' or 'night'.";
        }
        this.player.time = time;
        return this.get_mood_response('time', { time });
    }

    handle_weather(weather) {
        if (!['clear', 'rain', 'thunder'].includes(weather)) {
            return "Invalid weather. Use 'clear', 'rain', or 'thunder'.";
        }
        this.player.weather = weather;
        return this.get_mood_response('weather', { weather });
    }

    handle_give(item) {
        if (!item) {
            return "Please specify an item to give.";
        }
        this.player.inventory.push(item);
        return this.get_mood_response('give', { item });
    }

    handle_gamemode(mode) {
        if (!['survival', 'creative'].includes(mode)) {
            return "Invalid game mode. Use 'survival' or 'creative'.";
        }
        this.player.gamemode = mode;
        const action = mode === 'creative' ? 'fly around' : 'survive';
        return this.get_mood_response('gamemode', { mode, action });
    }

    handle_village(action) {
        switch (action) {
            case 'info':
                return this.get_mood_response('village', {
                    name: this.player.village.name,
                    pop: this.player.village.population,
                    happy: this.player.village.happiness,
                    resources: `Food: ${this.player.village.resources.food}, Wood: ${this.player.village.resources.wood}, Stone: ${this.player.village.resources.stone}`
                });
            case 'build':
                this.player.village.population += 1;
                this.player.village.happiness += 5;
                return "A new building has been constructed! The village grows!";
            case 'expand':
                this.player.village.resources.food += 50;
                this.player.village.resources.wood += 50;
                this.player.village.resources.stone += 50;
                return "The village has expanded its resources!";
            default:
                return "Invalid village action. Use 'info', 'build', or 'expand'.";
        }
    }

    handle_marriage(villagerName) {
        if (!villagerName) {
            return "Please specify a villager to marry.";
        }
        if (this.player.family.spouse) {
            return "You are already married!";
        }
        this.player.family.spouse = villagerName;
        this.player.village.happiness += 10;
        return this.get_mood_response('marriage', { spouse: villagerName });
    }

    handle_adoption(childName) {
        if (!childName) {
            return "Please specify a child's name.";
        }
        if (this.player.family.children.length >= 3) {
            return "Your family is already complete!";
        }
        this.player.family.children.push(childName);
        this.player.village.happiness += 5;
        return this.get_mood_response('adoption', { child: childName });
    }

    handle_profession(profession) {
        if (!this.professions[profession]) {
            return "Invalid profession. Choose from: farmer, blacksmith, librarian, builder, guard, mayor";
        }
        this.player.profession = profession;
        const prof = this.professions[profession];
        return this.get_mood_response('profession', {
            prof: profession,
            skills: prof.skills.join(', '),
            tasks: prof.tasks.join(', ')
        });
    }

    handle_building(structure) {
        const validStructures = ['house', 'shop', 'farm'];
        if (!validStructures.includes(structure)) {
            return "Invalid structure. Choose from: house, shop, farm";
        }
        if (this.player.village.resources.wood < 20 || this.player.village.resources.stone < 20) {
            return "Not enough resources to build! Need wood and stone.";
        }
        this.player.village.resources.wood -= 20;
        this.player.village.resources.stone -= 20;
        this.player.village.population += 1;
        return `A new ${structure} has been built!`;
    }

    handle_trade(villagerName, item) {
        if (!villagerName || !item) {
            return "Please specify a villager and item to trade.";
        }
        if (this.player.inventory.includes(item)) {
            this.player.inventory = this.player.inventory.filter(i => i !== item);
            this.player.village.happiness += 2;
            return `Successfully traded ${item} with ${villagerName}!`;
        }
        return `You don't have ${item} to trade!`;
    }

    isGreeting(input) {
        const normalizedInput = input.toLowerCase().trim();
        return this.greetingTriggers.some(trigger => 
            normalizedInput.includes(trigger) || 
            normalizedInput.startsWith(trigger) || 
            normalizedInput.endsWith(trigger)
        );
    }

    get_greeting_response() {
        const greeting = this.greetings[Math.floor(Math.random() * this.greetings.length)];
        return this.get_mood_response('greeting', { greeting });
    }
}

export default SteveLogic; 