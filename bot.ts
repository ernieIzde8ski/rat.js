const secrets = require('./secrets.json')
const config = require('./config.json')

const Discord = require('discord.js');
const client = new Discord.Client();

var cmds = [
	{
		"name": ["ping", "p"],
		"desc": ["Responds"],
		"func": (args, msg) => msg.channel.send("This is a response")
	},
	{
		"name": ["help", "h"],
		"desc": "Lists commands",
		"func": (args, msg) => {
			var resp = "```";
			cmds.forEach(cmd => resp += `\n${cmd.name[0]}: ${cmd.desc}`);
			resp += "\n```"
			msg.channel.send(resp)
		}
	}
]

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

	
	cmds.forEach(cmd => {
		if (cmd.name.includes(command)) {
			cmd.func(args, message);
			return;
		}
	});


})

client.login(secrets.token);
