const { argsExist } = require("./checks");
const owoify = require("../functions/owoify");

module.exports = {
    "name": ["owoify", "owo", "o"],
    "desc": "Return an owoified message",
    "func": (msg, args) => msg.channel.send(owoify(args.join(" "))),
    "checks": argsExist
};