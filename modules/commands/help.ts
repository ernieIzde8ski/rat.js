import { Bot } from "../../bot";
import { Command } from "../commands";
import { Context } from "../context";
import { BadCommandError } from "../errors";

async function send_full_help(bot: Bot, ctx: Context): Promise<void> {
    let command_max_length = 0;
    for (var command of bot.commands.array) {
        if (command.name.length > command_max_length)
            command_max_length = command.name.length;
    }
    command_max_length += 4;

    let current_group = undefined;
    let resp = "```\n";
    for (var command of bot.commands.array) {
        if (command.group !== current_group) {
            current_group = command.group;
            resp += (current_group + ":\n");
        }
        resp += ("   " + command.name);
        if (command.desc !== "") {
            var spaces = " ".repeat(command_max_length - command.name.length);
            resp += (spaces + command.desc);
        };
        resp += "\n";
    }
    resp += "\nType '{PREFIX}help command' for more information on a command.\n";
    resp += "```";
    await ctx.send(resp.replace("{PREFIX}", ctx.invoked_with));
}

async function send_command_help(ctx: Context, command: Command): Promise<void> {
    let resp = "```\n";
    if (command.parents.length) {
        resp += `${ctx.invoked_with}${command.parents.join(" ")} [${command.names.join("|")}]\n`;
    } else {
        resp += `${ctx.invoked_with}[${command.names.join("|")}]\n`;
        if (command.desc || command.extdesc) resp += "\n";
    }
    if (command.desc) resp += `${command.desc}\n`;
    if (command.extdesc) resp += `\n${command.extdesc}\n`;

    if (command.cmds.array.length) {
        let max_spaces: number = 0;
        let cmds = command.cmds.array.map(cmd => [cmd.name, cmd.desc]);
        for (var cmd of cmds) {
            if (cmd[0].length > max_spaces) max_spaces = cmd[0].length;
        } max_spaces += 4;

        resp += "\nCommands:\n";
        for (var cmd of cmds) {
            resp += ("  " + cmd[0] + " ".repeat(max_spaces - cmd[0].length) + cmd[1] + "\n");
        }
        resp += "\n";
    }
    resp += `Type ${ctx.invoked_with}help command for more information on a command.`;
    await ctx.send(resp + "\n```");
}

module.exports = {
    "cmds": [
        {
            name: "help",
            aliases: ["h", "commands", "cmds"],
            desc: "Shows support information",
            func: async (bot: Bot, ctx: Context) => {
                if (ctx.args.length === 0) {
                    await send_full_help(bot, ctx);
                } else {
                    ctx.command = ctx.args.shift();
                    let command = bot.commands.get(ctx);
                    if (command === null) throw new BadCommandError()
                    await send_command_help(ctx, command);
                }
            }
        }
    ],
    "initialize": async (bot: Bot) => {

    }
}
