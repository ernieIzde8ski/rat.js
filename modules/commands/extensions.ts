import { CommandModule, Client, Commands, file_to_command_group, Context } from "../commands";
import * as errors from "../errors";
import * as fs from 'fs/promises';
import { Util } from "discord.js";
// TODO: Add command descriptions smdh

/** Loads an extension by filepath. May throw errors. */
function Load(bot: Client, fp: string): void {
    if (bot.commands.filter(cmd => cmd.fp === fp).length) throw new errors.ExtensionAlreadyLoaded(fp);
    try {
        const arr = file_to_command_group(fp);
        bot.commands = new Commands(...bot.commands.concat(arr));
    } catch (e) {
        console.log(e);
        throw new errors.ExtensionLoadError(fp, e);
    }
}
/** Unloads an extension by filepath or group name. May throw errors. */
function Unload(bot: Client, fp_or_group: string): void {
    const original_length = bot.commands.length;
    bot.commands = new Commands(...bot.commands.filter(cmd => ![cmd.group, cmd.fp].includes(fp_or_group)));
    if (bot.commands.length === original_length) throw new errors.ExtensionNotLoaded(fp_or_group);
}
/** Reloads an extension by filepath or group name. May throw errors. */
function Reload(bot: Client, fp_or_group: string): void {
    const paths = new Set(bot.commands.filter(cmd => [cmd.group, cmd.fp].includes(fp_or_group)).map(cmd => cmd.fp));
    if (!paths.size) throw new errors.ExtensionNotLoaded(fp_or_group);
    for (var path of paths) {
        Unload(bot, path);
        Load(bot, path);
    }
}

/** Default split options for the func response. */
const SplitOptions = {
    prepend: "```\n",
    append: "\n```",
    maxLength: 1800
}

/** 
 * Loads, unloads, or reloads a series of filepaths/groups. If the --save
 * flag is enabled, this will dump to loaded_json and will be
 * reused on startup. Note this will be overwritten when compiling. 
 */
async function func(bot: Client, ctx: Context, args: Set<string>, func: Function): Promise<string[]> {
    let resp: string = "```\n";
    // Run the loading function for each argument and append response with result.
    for (const arg of args) {
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
    // Save the filepaths.
    if (ctx.flags.save == true) {
        const set = [...new Set(bot.commands.map(command => command.fp))];
        try {
            await fs.writeFile("./build/modules/commands/loaded_json", JSON.stringify([...set]));
            resp += `Saved the following filepaths to loaded_json: ${set.join(", ")}\n`;
        } catch (e) {
            resp += `${e.name}: Could not save filepaths.`
        }

    }
    resp += "```";
    // Split the message up into multiple if necessary so that they do not
    // exceed the 2000 character limit imposed by Discord.
    return Util.splitMessage(resp, SplitOptions);
}

const Extensions: CommandModule = {
    cmds: [{
        name: "load", aliases: ["l"], func: async (bot, ctx) => {
            // Split arguments by commas & spaces, load them, and return the responses.
            const args = new Set(ctx.args.join(" ").split(/,\s*|\s+/gm));
            const resps = await func(bot, ctx, args, Load);
            for (var resp of resps) await ctx.send(resp);
        },
        check: async (bot, ctx) => ctx.message.author.id == bot.application.owner.id
    }, {
        name: "unload", aliases: ["u"], func: async (bot, ctx) => {
            // Split arguments by commas & spaces, unload them, and return the responses.
            const args = new Set(ctx.args.join(" ").split(/,\s*|\s+/gm));
            const resps = await func(bot, ctx, args, Unload);
            for (var resp of resps) await ctx.send(resp);
        },
        check: async (bot, ctx): Promise<boolean> => ctx.message.author.id == bot.application.owner.id
    }, {
        name: "reload", aliases: ["r"], func: async (bot, ctx) => {
            // Split arguments by commas & spaces, reload them, and return the responses.
            const args = new Set(ctx.args.join(" ").split(/,\s*|\s+/gm));
            const resps = await func(bot, ctx, args, Reload);
            for (var resp of resps) await ctx.send(resp);
        }, check: async (bot, ctx): Promise<boolean> => ctx.message.author.id == bot.application.owner.id
    }]
}

module.exports = Extensions
