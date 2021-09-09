import { Bot, Context } from "../commands";

function random_choice(arr: Array<any>): any {
    if (!arr.length) throw new Error();
    return arr[Math.floor(arr.length * Math.random())];
}
function random_song(arr: Array<string>): string {
    if (!arr?.length) return "7-iRf9AWoyE";
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
    }, {
        name: "random_song", aliases: ["rs", "song"],
        desc: "Return a random song",
        func: async (bot: Bot, ctx: Context) => {
            await ctx.send(`https://youtu.be/${random_song(bot.configs.songs)}`
        }
    }]
} 
