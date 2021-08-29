import { Context } from "../context";

module.exports = {cmds: [{
    name: "context",
    aliases: ["ctx"],
    func: async (ctx: Context) => {
        // console.log(ctx)
        let ctx_string = ctx.toString();
        await ctx.send("Context: \n```CONTEXT\n```".replace("CONTEXT", ctx_string));
        
    },
    cmds: [
        {
            name: "test_command",
            aliases: ["test"],
            func: async (ctx: Context) => {
                await ctx.message.channel.send("test received 👍")
            }
        }
    ]
}],
"name": "Contextualizing"}
