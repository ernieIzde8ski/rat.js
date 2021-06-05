const secrets = require('./secrets.json')
const config = require('./config.json')

const Discord = require('discord.js');
const client = new Discord.Client({"disableMentions": "everyone"});

// basics
const checks = require("./modules/checks")
const parse = require("./modules/command_parsing")

// command modules
const help = require("./modules/help")
const bible = require('./modules/bible');
const bm = require("./modules/bm")


var cmds = [
	{
		"name": ["help", "h", "command", "cmd", "commands", "cmds"],
		"desc": "Provide command information",
		"desc_ext": "Accepts a command as a parameter",
		"func": (args, msg) => {
			if (!args.length) {
				var resp = help.default_help(cmds, config.prefix);
			} else {
				var resp = help.command_help(cmds, config.prefix, args)
			}
			msg.channel.send(resp)
		}
	}, {
		// This command serves mainly as an example so I remember how to write commands
		// aliases; the first is used as the primary name -> required
		"name": ["ping", "p"],
		// description is used in help command; required
		"desc": "Respond",
		// optional: provide additional information in help command
		"desc_ext": "no, really",
		// main function; required
		"func": (args, msg) => {
			msg.channel.send(`No Lol`)
		},
		// optional: whether hidden or not in help command
		"hidden": true,
		// optional: checks; evaluated before executing a command
		// are not parsed on subcommands
		"checks": [checks.return_false, checks.is_owner],
		// subcommands
		// they use the same format as other commands
		"cmds": [
			{
				"name": ["bear"],
				"desc": "CRINGE BEAR",
				"func": (args, msg) => msg.channel.send("CRINGE BEAR"),
				"cmds": [
					{
						"name": ["owner-only"],
						"desc": "Return arguments",
						"func": (args, msg) => {
							if (!checks.is_owner(app, msg)) {msg.channel.send("You are not the owner !!!!!"); return;};
							if (!args.length) msg.channel.send("you have no args");
							else msg.channel.send(`your arg(s) are: ${args}`);
						}
					}
				]
			},
			{
				"name": ["testing", "test", "t"],
				"desc": "Testing command",
				"func": (args, msg) => msg.channel.send("What")
			}
		]
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
			if (!args.length) { msg.channel.send("**You** are **cringe!!!!!!!!!!**"); return; };
			var resp = bm(args.join(" "));
			msg.channel.send(`**${resp.seed}** are **${resp.value}**${resp.punc}`)
		}
	}, {
		"name": ["xkcd", "x"],
		"desc": "Return an xkcd from an integer",
		"func": (args, msg) => msg.channel.send(`https://xkcd.com/${args[0]}`)
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

	var command_parsed = parse(app, cmds, command, args, message);
	if (!command_parsed) message.channel.send("That is not a command !!!!!!");

})

var app;
client.login(secrets.token)
	.then(x => client.fetchApplication()
		.then(application => app = application));
