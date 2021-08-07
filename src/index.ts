
const config = require("../config.json");
const token = require("../token.json");

const fparse = require("./modules/flag_parsing")
var str = require("./modules/string_functions");


const discord = require("discord.js");
const client = new discord.Client({
    "disableMentions": "everyone"
});


client.once("ready", () => {
    console.log(`${client.user.username}#${client.user.discriminator} is Online!`)
});


client.on("message", async message => {
    if (message.author.bot || !str.startsWithAny(message.content, config.prefix)) return;

    let cmd: string;
    let args = str.removeAnyPrefix(message.content, config.prefix).trim();
    [cmd, args] = str.splitOnce(args, /\s+/)
    let flags: Array<object> | undefined;

    // [args, flags] = fparse(args)

    let resp = `Your command is: \`${cmd}\`\n`;
    if (args !== "") resp += `Your argument(s) are: \`${args}\``
    await message.channel.send(resp);
});

const login = async () => {
    await client.login(token)
    client.application = await client.fetchApplication()
};

login();

