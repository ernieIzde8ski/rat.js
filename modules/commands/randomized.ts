import { Bot, Context } from "../commands";

function random_choice(arr: Array<any>): any {
    if (!arr.length) throw new Error();
    return arr[Math.floor(arr.length * Math.random())];
}

module.exports = {
    cmds: [{
        name: "random_choice", aliases: ["random", "pick"],
        desc: "Return a random selection from an array",
        func: async (bot: Bot, ctx: Context) => {
            const args = ctx.args.join(" ").split(/,\s*/gm);
            await ctx.send(random_choice(args));
        }
    }]
} 
