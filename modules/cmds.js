const checks = require("./cmds/checks")
// command modules
const ping = require("./cmds/ping")
const help = require("./cmds/help")
const bible = require("./cmds/bible");
const bm = require("./cmds/bm")
const xkcd = require("./cmds/xkcd");

generateCommands = (app, config) => [ping, bible, bm, xkcd, {
    "name": ["help", "h", "command", "cmd", "commands", "cmds"],
    "desc": "Provide command information",
    "desc_ext": "Accepts a command as a parameter",
    "func": (msg, args) => help(args, msg, generateCommands(app, config), config.prefix)
}]

module.exports = generateCommands