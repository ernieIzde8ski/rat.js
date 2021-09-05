import * as commands from "../commands";
import * as errors from "../errors";
import * as fs from 'fs/promises';
import { Util } from "discord.js";


function Load(bot: commands.Bot, fp: string): void {
    if (bot.commands.filter(cmd => cmd.fp === fp).length) throw new errors.ExtensionAlreadyLoaded(fp);
    try {
        const arr = commands.file_to_command_group(fp);
        bot.commands = new commands.Commands(...bot.commands.concat(arr));
    } catch (e) {
        throw new errors.ExtensionLoadError(fp, e);
    }
}
function Unload(bot: commands.Bot, fp_or_group: string): void {
    const original_length = bot.commands.length;
    console.log(bot.commands.filter(cmd => [cmd.group, cmd.fp].includes(fp_or_group)).map(cmd => cmd.name))
    bot.commands = new commands.Commands(...bot.commands.filter(cmd => ![cmd.group, cmd.fp].includes(fp_or_group)));
    if (bot.commands.length === original_length) throw new errors.ExtensionNotLoaded(fp_or_group);
}
function Reload(bot: commands.Bot, fp_or_group: string): void {
    let paths = new Set(bot.commands.filter(cmd => [cmd.group, cmd.fp].includes(fp_or_group)).map(cmd => cmd.fp));
    if (!paths.size) throw new errors.ExtensionNotLoaded(fp_or_group);
    for (var path of paths) {
        Unload(bot, path);
        Load(bot, path);
    }
}


const SplitOptions = {
    prepend: "```\n",
    append: "\n```",
    maxLength: 1800
}

async function func(bot: commands.Bot, ctx: commands.Context, args: Set<string>, funcs: Function[]): Promise<string[]> {
    let resp: string = "```\n";
    for (var func of funcs) {
        for (var arg of args) {
            try {
                func(bot, arg);
                resp += `${func.name}ed ${arg}.\n`
            } catch (error) {
                if (ctx.flags.show_traceback || ctx.flags.show_stack) {
                    resp += (error.stack + "\n");
                } else {
                    resp += `${error.name}: ${error.message}\n`;
                }
            }
        }
    }
    if (ctx.flags.save == true) {
        let set = [...new Set(bot.commands.map(command => command.fp))];
        try {
            await fs.writeFile("./build/modules/commands/loaded_commands.json", JSON.stringify([...set]));
            resp += `Saved the following filepaths to loaded_commands.json: ${set.join(", ")}\n`;
        } catch (e) {
            resp += `${e.name}: Could not save filepaths.`
        }

    }
    resp += "```";
    return Util.splitMessage(resp, SplitOptions);
}


module.exports = {
    cmds: [{
        name: "load", aliases: ["l"], func: async (bot: commands.Bot, ctx: commands.Context) => {
            const args = new Set(ctx.args.join(" ").split(/,\s*|\s+/gm));
            let resps = await func(bot, ctx, args, [Load]);
            for (var resp of resps) await ctx.send(resp);

        }
    }, {
        name: "unload", aliases: ["u"], func: async (bot: commands.Bot, ctx: commands.Context) => {
            const args = new Set(ctx.args.join(" ").split(/,\s*|\s+/gm));
            let resps = await func(bot, ctx, args, [Unload]);
            for (var resp of resps) await ctx.send(resp);
        }
    }, {
        name: "reload", aliases: ["r"], func: async (bot: commands.Bot, ctx: commands.Context) => {
            const args = new Set(ctx.args.join(" ").split(/,\s*|\s+/gm));
            let resps = await func(bot, ctx, args, [Reload]);
            for (var resp of resps) await ctx.send(resp);
        }
    }
    ]
}
