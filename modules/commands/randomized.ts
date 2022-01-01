import { CommandModule } from "../commands";
import { choice, rand_int } from "../random";
const sr = require("seedrandom");


function random_song(arr: Array<string>): string {
    if (!arr.length) return "7-iRf9AWoyE";
    return choice(arr);
}


function random_percent(rng: Function = Math.random, precision: number = 2): number {
    return Math.round(rng() * (10 ** (precision + 2))) / 10 ** (precision);
}


const Randomized: CommandModule = {
    cmds: [{
        name: "random_choice", aliases: ["random", "choice", "pick"],
        desc: "Return a random selection from an array",
        func: async (bot, ctx) => await ctx.send(choice(ctx.args.join(" ").split(/,\s*/gm)))

    }, {
        name: "random_song", aliases: ["rs", "song"],
        desc: "Return a random song",
        func: async (bot, ctx) => await ctx.send(`https://youtu.be/${random_song(bot.configs.songs)}`)
    }, {
        name: "based_meter", aliases: ["bm"],
        desc: "Determine basedness",
        func: async (bot, ctx) => {
            let args = ctx.args.join(' ');
            if (!args.length) args = "Your";
            const rng = sr(args);
            const values = [choice(['based', 'cringe'], rng), choice(['!', '?', '.'], rng), rand_int(1, 7, rng)];
            const resp = `**${args.replace('*', "")}** are **${values[0]}${values[1].repeat(values[2])}**`;
            await ctx.send(resp);
        }
    }, {
        name: "gobi_meter", aliases: ["gm"],
        func: async (bot, ctx) => {
            const args = ctx.args.length ? ctx.args.join(" ") : "Your";
            await ctx.send(`**${args}** are **${random_percent(sr(args))}** percent **Gobi**.`);
        }
    }]
}


module.exports = Randomized;
