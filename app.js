const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');
const { token, googleAPIkey } = require('./config.json');
const reader = require('g-sheets-api');
const schedule = require('node-schedule');

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
	//gifs
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

	//giflist
	if(message.content.toLowerCase() === "giflist"){
		message.channel.send("<https://docs.google.com/spreadsheets/d/1GAgl3VNQAMRlCY2skEWvf7v-cO26sJ52NnS79JQ91DA/edit#gid=0>");
	}

	//Cap.gif
	if(message.content.toLowerCase().includes("damn") && !message.content.toLowerCase().includes("damnright.gif") && message.channel.name !== "the-therapy-couch"){
		message.channel.send("https://i.imgur.com/V5pFeic.gif")
		console.log("You got it, cap")
	}

	//Dab  
	if (message.content.toLowerCase() === "!dab") {
		let dabImage = "https://cdn.discordapp.com/attachments/456875845483757570/619267446322364426/1929402_1005494306791_3146_n.png";
		message.channel.send(dabImage);
		console.log("ヽ( •_•)ᕗ");
	}

	//High Five
	if (message.content.toLowerCase() === "hi5.gif" || message.content.toLowerCase().includes("janet, hi5") || message.content.toLowerCase().includes("janet, high five")) {
		let pic = "https://66.media.tumblr.com/f9aa4cf7be5072dd8dfd4ce73597a474/tumblr_oyee7p3N351wtl4k2o2_250.gif";
		message.channel.send(pic).then(
		setTimeout(function () {
		  message.channel.send("hi5");
		  }, 3000)
		);
		console.log("Thanks, babe.");
	}

	//Kill the poor
	const killPoorPattern = /.*kill.*the poor.*/i;
	if (killPoorPattern.test(message.content)) {
		const killThePoorArray = [
			"With respect, we've had this conversation before...",
			"I'm not saying _do_ it; I'm just saying run it through the computer, see if it would work.",
			"So you think it _might_ work?",
			"We need them for all the things that we don't fancy.",
			"Are you thinking of immigrants?",
			"I can't believe you haven't done it drunk as a joke.",
			"Have you tried raise VAT and kill all the poor?",
			"The computer says it wouldn't help, so we're not doing it!",
			"Bloody hell, now _I'm_ offended!",
			"It's morally wrong, _" + message.author.username + "_.",
			"Shave half a percent off interest rates, shore up the pound, keep VAT steady for now, and round up all the dwarfs."
		];
		message.channel.send(killThePoorArray[Math.floor(Math.random()*killThePoorArray.length)]);
		console.log("https://www.youtube.com/watch?v=owI7DOeO_yg");
	}

});

//Timed messages go here. Use Cron format for the date and time.
client.on('ready',() => {
	//October 24
	schedule.scheduleJob('0 10 24 10 *', function(){
		client.channels.cache.get('456875845483757570').send("https://cdn.discordapp.com/attachments/456875845483757570/1299039715315421345/image0.jpg?ex=671e6383&is=671d1203&hm=16b94aed91cc05cebb59406595874d6badd87009778e15cfe2ba466c2903eefb&");
	})
})

// Log in to Discord with your client's token
client.login(token);