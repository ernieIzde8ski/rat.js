const checks = require("./cmds/checks")
// command modules
const ping = require('./cmds/ping')
const help = require("./cmds/help")
const bible = require('./cmds/bible');
const bm = require("./cmds/bm")
const xkcd = require("./cmds/xkcd");

generateCommands = (app, config) => [ping, {
    "name": ["help", "h", "command", "cmd", "commands", "cmds"],
    "desc": "Provide command information",
    "desc_ext": "Accepts a command as a parameter",
    "func": (msg, args) => help(args, msg, generateCommands(app, config), config.prefix)
}, {
    "name": ["bible_verse", "verse", "v", "🙏"],
    "desc": "Return a bible verse",
    "desc_ext": "usual format is <Book> <Chapter>:<Verse>",
    "func": (msg, args) => {
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
    "func": (msg, args) => {
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
    "func": (msg, args) => msg.channel.send(`https://xkcd.com/${args[0]}`),
    "checks": [xkcd.isRealXKCD],
    "cmds": [{
            "name": ["random", "r"],
            "desc": "Returns a random xkcd",
            "func": (msg, args) => msg.channel.send(xkcd.random())
        },
        {
            "name": ["latest", "l"],
            "desc": "Returns the latest xkcd",
            "func": (msg, args) => msg.channel.send(xkcd.l)
        }
    ]

}]

module.exports = generateCommands