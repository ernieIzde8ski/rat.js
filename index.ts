import * as token from "./token.json";
import { Client } from "@typeit/discord";
import { Message } from "discord.js";
const client = new Client({
    classes: [
        `${__dirname}/*Discord.ts`,
    ],
    silent: false,
    variablesChar: ":",
});

client.once("ready", () => { console.log(client.user.tag + " is Online!") })

client.on("message", async (message: Message) => {

    if (message.channel.type === "text" || message.channel.type === "news")
        if (message.channel.name === "krysa" && message.content !== "krysa")
            try { return await message.delete() } catch (e) { return };
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes("krysa")) message.channel.send("krysa");
})

async function start() {
    await client.login(token);
    // const application = await client.fetchApplication();
}

start();
