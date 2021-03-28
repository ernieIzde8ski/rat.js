// have no idea what ts-ignore does but it makes the linter stop complaining
// @ts-ignore
const secrets = require('./secrets.json')
// @ts-ignore
const Discord = require('discord.js');
const client = new Discord.Client();


client.once('ready', () => {
	console.log(`${client.user.username}#${client.user.discriminator} Online!`);
});

client.on('message', message => {
	if (message.author.bot) {
		return
	}
	else if (message.content == 'rata') {
		message.channel.send('rata')
	}
});


client.login(secrets.token);
