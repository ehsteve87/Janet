const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');
const { token, googleAPIkey } = require('./config.json');
const reader = require('g-sheets-api');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Commands that read from messages go here
client.on('messageCreate', message => {
	if(message.content.slice(-4)===".gif") {
		const readerOptions = {
            apiKey: googleAPIkey,
            sheetId: '1GAgl3VNQAMRlCY2skEWvf7v-cO26sJ52NnS79JQ91DA',
            returnAllResults: false,
            filter: {
                'Call': message.content,
                },
            };
		
		reader(readerOptions, (results) => {
			try {
				let gifURL = results[0].URL
				message.channel.send(gifURL) //this line is inside a callback function to make sure gifURL has a value before it gets called
			} catch (err) {
				//pass
			}
		});
	}

	if(message.content.toLowerCase() === "giflist"){
		message.channel.send("<https://docs.google.com/spreadsheets/d/1GAgl3VNQAMRlCY2skEWvf7v-cO26sJ52NnS79JQ91DA/edit#gid=0>")
	}

	if(message.content.toLowerCase().includes("damn") && !message.content.toLowerCase().includes("damnright.gif")){
		message.channel.send("https://i.imgur.com/V5pFeic.gif")
		console.log(message)
	}

});

// Log in to Discord with your client's token
client.login(token);