import { Bot, Context } from "../commands";
const seedrandom = require("seedrandom");


function random_choice(arr: Array<any>, rng: Function = Math.random): any {
    if (!arr.length) throw new Error();
    return arr[Math.floor(arr.length * rng())];
}
function random_song(arr: Array<string>): string {
    if (!arr?.length) return "7-iRf9AWoyE";
    return arr[Math.floor(arr.length * Math.random())];
}
function random_int(start: number, stop: number, rng: Function = Math.random): number {
    return Math.floor(stop * rng() + start);
}
function random_percent(rng: Function = Math.random, precision: number = 2): number {
    return Math.round(rng() * (10 ** (precision + 2))) / 10 ** (precision)
}


module.exports = {
    cmds: [{
        name: "random_choice", aliases: ["random", "pick"],
        desc: "Return a random selection from an array",
        func: async (bot: Bot, ctx: Context) => {
            const args = ctx.args.join(" ").split(/,\s*/gm);
            await ctx.send(random_choice(args));
        }
    }, {
        name: "random_song", aliases: ["rs", "song"],
        desc: "Return a random song",
        func: async (bot: Bot, ctx: Context) => await ctx.send(`https://youtu.be/${random_song(bot.configs.songs)}`)
    }, {
        name: "based_meter", aliases: ["bm"],
        desc: "Determine basedness",
        func: async (bot: Bot, ctx: Context) => {
            let args = ctx.args.join(' ');
            if (!args.length) args = "Your";
            const rng = seedrandom(args);
            const values = [random_choice(['based', 'cringe'], rng), random_choice(['!', '?', '.'], rng), random_int(1, 7, rng)];
            const resp = `**${args.replace('*', "")}** are **${values[0]}${values[1].repeat(values[2])}**`;
            await ctx.send(resp);
        }
    }, {
        name: "gobi_meter", aliases: ["gm"],
        func: async (bot: Bot, ctx: Context) => {
            const args = ctx.args.length ? ctx.args.join(" ") : "Your";
            const seed = seedrandom(args);
            await ctx.send(`**${args}** are **${random_percent(seed)}** percent **Gobi**.`);
        }
    }]
}
