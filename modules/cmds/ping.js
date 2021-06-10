const checks = require("./checks")
module.exports = {
    // This command serves mainly as an example so I remember how to write commands
    // aliases; the first is used as the primary name -> required
    "name": ["ping", "p"],
    // description is used in help command; required
    "desc": "Respond",
    // optional: provide additional information in help command
    "desc_ext": "no, really",
    // main function; required
    "func": (msg, args) => {
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
            "func": (msg, args) => msg.channel.send("CRINGE BEAR"),
            "cmds": [{
                "name": ["owner-only", "o"],
                "desc": "Return arguments",
                "func": (msg, args) => {
                    var resp = "";
                    if (args.length) resp += `your arg(s) are: ${args}\n`.replace(/,/g, ', ');
                    keys = Object.keys(msg.tags)
                    if (keys.length) {
                        var tags = [];
                        for (key of keys) {
                            tags.push(`${key}:${msg.tags[key]}`)
                        }
                        resp += `your tag(s) are: ${tags}`.replace(/,/g, ', ');
                    };
                    msg.channel.send(resp)
                },
                "checks": [checks.is_owner, checks.cleanArgsOrTagsExist]
            }]
        },
        {
            "name": ["testing", "test", "t"],
            "desc": "Testing command",
            "func": (msg, args) => msg.channel.send("What")
        }
    ]
}