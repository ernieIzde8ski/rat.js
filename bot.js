// easily customizable variables
const secrets = require("./secrets.json");
const config = require("./config.json");

// command parsing
const setTags = require("./modules/tag_parsing");
const parse = require("./modules/command_parsing");
const cmds_ = require("./modules/cmds");

// message handling
const react = require("./modules/reactions");
const owo = require("./modules/functions/owoify");

// continued at bottom
const Discord = require("discord.js");
const client = new Discord.Client({
    "disableMentions": "everyone"
});

const startsWithAny = (str, prefixes) => {
    if (typeof prefixes == "string")
        prefixes = [prefixes];
    // if it does not begin with any
    return Boolean(prefixes.filter(prefix => str.startsWith(prefix)).length);
};

const removePrefixes = (str, prefixes) => {
    if (typeof prefixes == "string")
        prefixes = [prefixes];
    prefixes = prefixes.filter(prefix => str.startsWith(prefix));
    for (var prefix of prefixes) {
        if (!str.startsWith(prefix)) continue;
        str = str.slice(prefix.length);
    }
    return str;
};


client.once("ready", () => {
    console.log(`${client.user.username}#${client.user.discriminator} Online!`);
});

client.on("message", message => {
    if (message.author.bot) return;
    react(message);
    if (message.content == config.triggerWord) {
        message.channel.send(config.triggerWord);
        console.log(`${config.triggerWord} from ${message.author.username}#${message.author.discriminator}`);
    }
});

client.on("message", message => {
    if (message.author.id != 748969260344410283) return;
    resp = owo(message.content);
    message.channel.send(resp);
});

client.on("message", message => {
    if (!startsWithAny(message.content, config.prefix) || message.author.bot) return;

    const prefixes = ["–", "--", "-"];

    var args = removePrefixes(message.content, config.prefix).trim().split(" ");
    var command = args.shift().toLowerCase();

    var tags = args.filter(arg => startsWithAny(arg, prefixes)).map(arg => removePrefixes(arg, prefixes));
    args = args.filter(arg => !startsWithAny(arg, prefixes));

    setTags(message, tags).then(message =>
        parse(client.application, cmds, command, args, message)
        .then(parsed => {
            if (!parsed) message.channel.send("That is not a command !!!!!");
        })
    );
});



var cmds = [];
client.login(secrets.token)
    .then(x => client.fetchApplication()
        .then(application => {
            client.application = application;
            cmds = cmds_(client.application, config);
        }));