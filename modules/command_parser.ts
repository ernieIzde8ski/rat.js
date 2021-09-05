import { Message } from "discord.js";
import * as loaded_commands from "./commands/loaded_commands.json"
import { BadCommandError } from "./errors";
import { RawCommand, Command, Commands, context_from_message, file_to_command_group } from "./commands";
import { Bot } from "./commands";

type raw_command_group = { cmds: RawCommand[], name?: string, initialize?: Function };

function group_to_titlecase(group: string): string {
    return group.replace("_", " ").split(/\s+/).filter(str => str.length).map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");
}


export function initialize(bot: Bot) {
    let commands: Command[] = [];
    for (var fp of loaded_commands) {
        let cmds = file_to_command_group(fp);
        commands = commands.concat(...cmds)
    }
    bot.commands = new Commands(...commands)
    console.log("Loaded commands: ", bot.commands.names().join(", "));
}


export async function parse_command(bot: Bot, prefix: string, message: Message): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    let ctx = context_from_message(prefix, message);

    let command = bot.commands.get(ctx);
    if (command === null) throw new BadCommandError();
    await command.func(bot, ctx);

}
