const checks = require("./cmds/checks")
// command modules
const help = require("./cmds/help")
const bible = require('./cmds/bible');
const bm = require("./cmds/bm")
const xkcd = require("./cmds/xkcd");

generateCommands = (app, config) => [{
	"name": ["help", "h", "command", "cmd", "commands", "cmds"],
	"desc": "Provide command information",
	"desc_ext": "Accepts a command as a parameter",
	"func": (msg, args, tags) => {
		if (!args.length) {
			var resp = help.default_help(generateCommands(app, config), config.prefix, tags);
		} else {
			var resp = help.command_help(generateCommands(app, config), config.prefix, args, tags)
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
	"func": (msg, args, tags) => {
		msg.channel.send(`No Lol`)
	},
	// optional: whether hidden or not in help command
	"hidden": true,
	// optional: checks; evaluated before executing a command
	// are not parsed on subcommands
	"checks": [checks.return_false, checks.is_owner],
	// subcommands
	// they use the same format as other commands
	"cmds": [{
			"name": ["bear", "b"],
			"desc": "CRINGE BEAR",
			"func": (msg, args, tags) => msg.channel.send("CRINGE BEAR"),
			"cmds": [{
				"name": ["owner-only", "o"],
				"desc": "Return arguments",
				"func": (msg, args, tags) => msg.channel.send(`your arg(s) are: ${args}`),
				"checks": [checks.is_owner, checks.argsExist, checks.cleanArgsExist]
			}]
		},
		{
			"name": ["testing", "test", "t"],
			"desc": "Testing command",
			"func": (msg, args, tags) => msg.channel.send("What")
		}
	]
}, {
	"name": ["bible_verse", "verse", "v", "🙏"],
	"desc": "Return a bible verse",
	"desc_ext": "usual format is <Book> <Chapter>:<Verse>",
	"func": (msg, args, tags) => {
		var arg = args.join(" ")
		bible.get_verse(args.join(" ")).then(text => {
			if (text.text.length > 1000) {
				msg.channel.send(`Too long\nthis link might work: ${text.url}`);
				return;
			};
			var message = `**${text.ref}**\n`;
			message += `>>> ${text.text}`;
			msg.channel.send(message);
		});
	},
	"checks": [checks.argsExist]
}, {
	"name": ["based_cringe_meter", "bm"],
	"desc": "Return judgement",
	"desc_ext": "Requires an argument",
	"func": (msg, args, tags) => {
		if (!args.length) {
			msg.channel.send("**You** are **cringe!!!!!!!!!!**");
			return;
		};
		var resp = bm(args.join(" "));
		msg.channel.send(`**${resp.seed}** are **${resp.value}**${resp.punc}`)
	}
}, {
	"name": ["xkcd", "x"],
	"desc": "Return an xkcd from an integer",
	"func": (msg, args, tags) => msg.channel.send(`https://xkcd.com/${args[0]}`),
	"checks": [xkcd.isRealXKCD],
	"cmds": [{
			"name": ["random", "r"],
			"desc": "Returns a random xkcd",
			"func": (msg, args, tags) => msg.channel.send(xkcd.random())
		},
		{
			"name": ["latest", "l"],
			"desc": "Returns the latest xkcd",
			"func": (msg, args, tags) => msg.channel.send(xkcd.l)
		}
	]

}]

module.exports = generateCommands