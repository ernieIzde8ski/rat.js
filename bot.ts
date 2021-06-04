const secrets = require('./secrets.json')
const config = require('./config.json')

const Discord = require('discord.js');
const client = new Discord.Client();

const bible = require('./modules/bible');
const help = require("./modules/help")
const bm = require("./modules/bm")


var cmds = [
	{
		"name": ["help", "h"],
		"desc": "Provide command information",
		"desc_ext": "Accepts a command as a parameter",
		"func": (args, msg) => {
			if (!args.length) {
				var resp = help.default_help(cmds, spaces_maximum, config.prefix);
			} else {
				var resp = help.command_help(cmds, args[0], config.prefix)
			}
			msg.channel.send(resp)
		}
	}, {
		"name": ["ping", "p"],
		"desc": "Respond",
		"desc_ext": "no, really",
		"hidden": true,
		"func": (args, msg) => msg.channel.send("No Lol")
	}, {
		"name": ["bible_verse", "verse", "v", "🙏"],
		"desc": "Return a bible verse",
		"desc_ext": "usual format is <Book> <Chapter>:<Verse>",
		"func": (args, msg) => {
			var arg = args.join(" ")
			if (!arg.length) {
				msg.channel.send("Please provide Input");
				return;
			}
			bible.get_verse(args.join(" ")).then(text => {
				if (text.text.length > 1000) { msg.channel.send(`Too long\nthis link might work: ${text.url}`); return; };
				var message = `**${text.ref}**\n`;
				message += `>>> ${text.text}`;
				msg.channel.send(message);
			});
		}
	}, {
		"name": ["based_cringe_meter", "bm"],
		"desc": "Return judgement",
		"desc_ext": "Requires an argument",
		"func": (args, msg) => {
			if (!args.length) {msg.channel.send("**You** are **cringe!!!!!!!!!!**"); return;};
			var resp = bm(args.join(" "));
			msg.channel.send(`**${resp.seed}** are **${resp.value}**${resp.punc}`)
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

	var command_parsed = false
	cmds.forEach(cmd => {
		if (cmd.name.includes(command)) {
			cmd.func(args, message);
			return command_parsed = true;
		}
	});
	if (!command_parsed) message.channel.send("That is not a command !!!!!!");

})

client.login(secrets.token);
