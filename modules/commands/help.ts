import { Client, Command, Commands, Context, CommandModule } from "../commands";
import { BadCommandError } from "../errors";


/** Returns the full command list.
 * Use the --show_all flag to display all commands, regardless of ability to use.*/
async function send_full_help(bot: Client, ctx: Context): Promise<void> {
    let command_max_length = 0;
    let commands: Commands = bot.commands;
    if (!ctx.flags.show_all) {
        commands = new Commands(...await commands.asyncFilter(async command => await command.check(bot, ctx)));
    }
    for (const command of commands) {
        if (command.name.length > command_max_length) command_max_length = command.name.length;
    }
    command_max_length += 4;

    let current_group = undefined;
    let resp = "```\n";
    for (const command of commands) {
        if (command.group !== current_group) {
            current_group = command.group;
            resp += (current_group + ":\n");
        }
        resp += ("   " + command.name);
        if (command.desc !== "") {
            const spaces = " ".repeat(command_max_length - command.name.length);
            resp += (spaces + command.desc);
        };
        resp += "\n";
    }
    resp += "\nType '{PREFIX}help command' for more information on a command.\n";
    resp += "```";
    await ctx.send(resp.replace("{PREFIX}", ctx.invoked_with));
}

/** Returns the help page of a specific command. */
async function send_command_help(ctx: Context, command: Command): Promise<void> {
    let resp = "```\n";
    const names = Array(...command.names).join("|");
    if (command.parents) {
        resp += `${ctx.invoked_with}${command.parents} [${names}]\n`;
    } else {
        resp += `${ctx.invoked_with}[${names}]\n`;
    }
    if (command.desc || command.extdesc) resp += "\n";
    if (command.desc) resp += `${command.desc}\n`;
    if (command.extdesc) resp += `\n${command.extdesc}\n`;

    if (command.cmds.length) {
        let max_spaces = 0;
        const cmds = command.cmds.map(cmd => [cmd.name, cmd.desc]);
        for (var cmd of cmds) {
            if (cmd[0].length > max_spaces) max_spaces = cmd[0].length;
        } max_spaces += 4;

        resp += "\nCommands:\n";
        for (const cmd of cmds) {
            resp += ("  " + cmd[0] + " ".repeat(max_spaces - cmd[0].length) + cmd[1] + "\n");
        }
        resp += "\n";
    }
    resp += `Type ${ctx.invoked_with}help command for more information on a command.`;
    await ctx.send(resp + "\n```");
}


const Help: CommandModule = {
    "cmds": [
        {
            name: "help",
            aliases: ["h", "commands", "cmds"],
            desc: "Shows support information",
            func: async (bot, ctx) => {
                if (ctx.args.length === 0) {
                    await send_full_help(bot, ctx);
                } else {
                    ctx.command = ctx.args.shift();
                    const command = bot.commands.get(ctx);
                    if (command === null) throw new BadCommandError()
                    await send_command_help(ctx, command);
                }
            }
        }
    ],
    "initialize": async bot => {

    }
}


module.exports = Help;
