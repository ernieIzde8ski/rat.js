const secrets = require('./secrets.json')
const config = require('./config.json')

const Discord = require('discord.js');
const client = new Discord.Client();


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

	if (command == "ping") {
		if (!args.length) {
			message.channel.send(config.respuesta)
		}
		else if ("everyone" in args || "here" in args) {
			message.channel.send(config.respuesta)
		}
		else {
			message.channel.send(`Youre Args Are ${args}`)
		}
	}
})

client.login(secrets.token);
