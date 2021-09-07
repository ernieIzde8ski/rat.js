import { Bot, Context } from "../commands";


module.exports = {
    cmds: [{
        name: "support", aliases: ["information", "info"], desc: "Provide support information",
        func: (bot: Bot, ctx: Context) => {
            await ctx.send
        }
    }]
}
