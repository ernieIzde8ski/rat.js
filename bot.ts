const token = require("./token.json")

const discord = require("discord.js");
const client = new discord.Client({
    "disableMentions": "everyone"
});

client.once("ready", () => {
    console.log(`${client.user.username}#${client.user.discriminator} is Online!`)
})

client.on()

const login = async () => {
    await client.login(token)
    client.application = await client.fetchApplication
}

login()