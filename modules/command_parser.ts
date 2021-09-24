import { Message } from "discord.js";
import * as loaded_commands from "./commands/loaded_commands.json"
import { BadCommandError, CheckFailure } from "./errors";
import { Command, Commands, context_from_message, file_to_command_group } from "./commands";
import { Client } from "./commands";

/**
 * Loads commands and sets them as a property of bot.
 */
export function initialize(bot: Client): void {
    let commands: Command[] = [];
    for (var fp of loaded_commands) {
        const cmds = file_to_command_group(fp);
        commands = commands.concat(...cmds)
    }
    bot.commands = new Commands(...commands)
    console.log("Loaded commands: ", bot.commands.names().join(", "));
}


/**
 * Parses a message for commands. While not returning anything, this may rarely throw an error.
 * @param bot A Discord client.
 * @param prefix String to check if a message is a command.
 * @param message A Discord message.
 * @returns void
 */
export async function parse_command(bot: Client, prefix: string, message: Message): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    const ctx = context_from_message(prefix, message);

    try {
        const command = bot.commands.get(ctx);
        if (command === null) throw new BadCommandError();
        if (await command.check(bot, ctx) === false) throw new CheckFailure(command.name);
        await command.func(bot, ctx);
    } catch (err) {
        let resp = "```\n";
        if (ctx.flags.show_stack) resp += err.stack + "\n";
        else resp += `${err.name}: ${err.message}\n`;

        if (err.name === "BadCommandError") {
            const match = bot.commands.fuzzy_get(ctx);
            if (match === null) resp += "No similar command was found.\n";
            else resp += `Closest similar command: ${match.name}\n`;
        }
        await ctx.send(resp + "```");
    }
}
