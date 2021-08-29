import * as configs from "./configs.json";
import * as token from "./token.json";

import { Context } from "./modules/context";
import { Message } from "discord.js";
import { Client } from "@typeit/discord";

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
        if (message.channel.name === configs.trigger && message.content !== configs.trigger)
            try { return await message.delete() } catch (e) { return };
    if (message.author.bot) return;
    if (message.content.split(" ").includes(configs.trigger)) message.channel.send(configs.trigger);

    if (message.content.startsWith(configs.prefix)) {
        let context = new Context(message, configs.prefix);
        message.channel.send("Context: \n```" + context.toString() + "\n```")
    };
})

async function start() {
    await client.login(token);
    // const application = await client.fetchApplication();
}

start();
