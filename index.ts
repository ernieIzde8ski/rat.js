import * as configurations from "./configurations.json";
import * as token from "./token.json";

import { initialize, parse_command} from "./modules/command_parser";
import { Message } from "discord.js";
import { Bot } from "./modules/commands";

const bot = new Bot(configurations);
initialize(bot);

bot.once("ready", () => { console.log(bot.user.tag + " is Online!") })

bot.on("message", async (message: Message) => {

    if (message.channel.type === "text" || message.channel.type === "news")
        if (message.channel.name === configurations.trigger && message.content !== configurations.trigger)
            try { return await message.delete() } catch (e) { return };
    if (message.author.bot) return;
    if (message.content.split(" ").includes(configurations.trigger)) message.channel.send(configurations.trigger);

    try {
        await parse_command(bot, configurations.prefix, message)
    } catch (Error) {
        message.channel.send(`${Error.name}: ${Error.message}`);
        console.log(Error.stack)
    }
})


bot.start(token);
