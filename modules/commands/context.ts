import { CommandModule } from "../commands";


const Context: CommandModule = {
    cmds: [{
        name: "context", aliases: ["ctx"],
        desc: "Display part of the Context class on a message",
        func: async (bot, ctx) => {
            const ctx_string = ctx.toString();
            await ctx.send("Context: \n```CONTEXT\n```".replace("CONTEXT", ctx_string));
        },
        cmds: [{
            name: "test_command", aliases: ["test"],
            func: async (bot, ctx) => await ctx.message.channel.send("Test received 👍")
        }]
    }],
    name: "Contextualizing"
}


module.exports = Context;
