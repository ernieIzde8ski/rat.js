import { Message } from "discord.js";
import * as loaded_commands from "./commands/loaded_commands.json"
import { BadCommandError } from "./errors";
import { RawCommand, Command, Commands, context_from_message } from "./commands";
import { Bot } from "./commands";


function group_to_titlecase(group: string): string {
    return group.replace("_", " ").split(/\s+/).filter(str => str.length).map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");
}


export function initialize(bot: Bot) {
    bot.commands = new Commands();
    for (var command_group_filepath of loaded_commands) {
        var command_group: { cmds: RawCommand[], name: string | undefined, initialize: Function | undefined } = require(`./commands/${command_group_filepath}`);
        if (command_group.name === undefined) command_group.name = group_to_titlecase(command_group_filepath);
        if (command_group.initialize !== undefined) command_group.initialize();
        for (var raw_command of command_group.cmds) {
            let command = new Command(command_group.name, [], raw_command);
            bot.commands.push(command);
        }
    }

    console.log("Loaded commands: ", bot.commands.array.map(command => command.name).join(", "))
}


export async function parse_command(bot: Bot, prefix: string, message: Message): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    let ctx = context_from_message(prefix, message);

    let command = bot.commands.get(ctx);
    if (command === null) throw new BadCommandError();
    await command.func(bot, ctx);

}
