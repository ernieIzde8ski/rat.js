// easily customizable variables
const secrets = require('./secrets.json')
const config = require('./config.json')

// command parsing
const parse = require("./modules/command_parsing")
const cmds_ = require("./modules/cmds")

// continued at bottom
const Discord = require('discord.js');
const client = new Discord.Client({ "disableMentions": "everyone" });


client.once('ready', () => {
	console.log(`${client.user.username}#${client.user.discriminator} Online!`);
});

client.on('message', message => {
	if (message.author.bot) return
	else if (message.content == config.trigger_word) {
		message.channel.send(config.trigger_word)
		console.log(`${config.trigger_word} from ${message.author.username}#${message.author.discriminator}`)
	}
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	var parsed = parse(app, cmds, command, args, message)
	if (!parsed) message.channel.send("That is not a command!!!!!");

})

var app;
var cmds = [];
client.login(secrets.token)
	.then(x => client.fetchApplication()
		.then(application => { 
			cmds = cmds_(application, config); 
			app = application;
			app.hypixel = secrets.hypixel_token
		}))
