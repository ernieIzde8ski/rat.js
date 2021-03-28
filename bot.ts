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
	if (message.author.bot) return
	else if (message.content == `${config.prefix}ping`) {
		message.channel.send(config.respuesta)
	}
})

client.login(secrets.token);
