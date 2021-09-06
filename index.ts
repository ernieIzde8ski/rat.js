import * as configurations from "./configurations.json";
import * as token from "./token.json";

import { initialize as initialize_commands, parse_command} from "./modules/command_parser";
import { Message } from "discord.js";
import { Bot } from "./modules/commands";

// Initialize the bot class and initialize its commands/events.
const bot = new Bot(configurations);
initialize_commands(bot);

bot.once("ready", () => { console.log(bot.user.tag + " is Online!") })

bot.on("message", async (message: Message) => {
    if (message.author.bot) return;
    // Attempt to delete messages where the content isn't 'rat' and the channel is '#rat'.
    if (message.channel.type === "text" || message.channel.type === "news")
        if (message.channel.name === configurations.trigger && message.content !== configurations.trigger)
            try { return await message.delete() } catch (e) { return };
    // Reply to messages containing 'rat' with 'rat'.
    if (message.content.split(" ").includes(configurations.trigger)) message.channel.send(configurations.trigger);
    // Return before trying to parse commands in channels named 'rat'.
    if ((message.channel.type === "text" || message.channel.type === "news") ? message.channel.name === configurations.trigger : false) return;


    try {
        await parse_command(bot, configurations.prefix, message);
    } catch (Error) {
        message.channel.send(`${Error.name}: ${Error.message}`);
        console.log(Error.stack)
    }
})


bot.start(token);
