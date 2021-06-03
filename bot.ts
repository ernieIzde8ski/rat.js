const secrets = require('./secrets.json')
const config = require('./config.json')

const Discord = require('discord.js');
const client = new Discord.Client();

var cmds = [
	{
		"name": ["help", "h"],
		"desc": "Provide command information",
		"desc_ext": "Accepts a command as a parameter",
		"func": (args, msg) => {
			var resp = "```";
			if (!args.length) {
				cmds.forEach(cmd => {
					spaces = " ".repeat(spaces_maximum - cmd.name[0].length);
					resp += `\n${cmd.name[0]}:${spaces}${cmd.desc}`
					resp += `\n\nType ${config.prefix}help for this message.`;
					resp += `\nYou can also type ${config.prefix}help <command> for more information on a command.`;});
				}
			else {
				cmds.forEach(cmd => {
					if (cmd.name.includes(args[0])) {
						resp += `\n${config.prefix}[${cmd.name}]\n`;
						resp += `\n${cmd.desc}\n${cmd.desc_ext}`;
				}
					
				})
				if (resp == "```") {
					msg.channel.send("That is not a command !!!!!!");
					return;
				};
			}
			resp += "\n```";
			msg.channel.send(resp)
		}
	}
]

// These spaces get used in the help command
var cmd;
var spaces_maximum = 0;
cmds.forEach(cmd => {
	if (cmd.name[0].length > spaces_maximum)
		spaces_maximum = cmd.name[0].length;
});
spaces_maximum += 3
var spaces = "";


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
