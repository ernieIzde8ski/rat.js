import { Message } from "discord.js";
import * as loaded_commands from "./commands/loaded_commands.json"
import { BadCommandError, CheckFailure } from "./errors";
import { Command, Commands, context_from_message, file_to_command_group } from "./commands";
import { Bot } from "./commands";

/**
 * Loads commands and sets them as a property of bot.
 */
export function initialize(bot: Bot): void {
    let commands: Command[] = [];
    for (var fp of loaded_commands) {
        let cmds = file_to_command_group(fp);
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
export async function parse_command(bot: Bot, prefix: string, message: Message): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    const ctx = context_from_message(prefix, message);

    const command = bot.commands.get(ctx);
    if (command === null) throw new BadCommandError();
    if (await command.check(bot, ctx) === false) throw new CheckFailure(command.name);
    await command.func(bot, ctx);
}
