import { Message } from "discord.js";
import { Context } from "./context";
import * as loaded_commands from "./commands/loaded_commands.json"
import { BadCommandError } from "./errors";
import { Command, Commands } from "./command_classes";


function group_to_titlecase(group: string): string {
    return group.replace("_", " ").split(/\s+/).filter(str => str.length).map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");
}


var commands = new Commands()
for (var command_group_filepath of loaded_commands) {
    var command_group: { cmds: { name: string, aliases: string[], func: Function, group: string | undefined, cmds: [] | undefined }[], name: string | undefined } = require(`./commands/${command_group_filepath}`);
    if (command_group.name === undefined) command_group.name = group_to_titlecase(command_group_filepath);
    for (var raw_command of command_group.cmds) {
        var command = new Command(command_group.name, [], raw_command);
        commands.push(command);
    }
}

// console.log("Loaded commands: ", commands.array)
console.log("Loaded commands: ", commands.array.map(command => command.name))


export async function parse_command(message: Message, prefix: string): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    let ctx = new Context(message, prefix);

    let command = commands.get(ctx);
    if (command === null) throw new BadCommandError();
    await command.func(ctx);

}