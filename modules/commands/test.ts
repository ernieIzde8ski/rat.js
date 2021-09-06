import { Bot, Context } from "../commands";

module.exports = {
    cmds: [{
        name: "Test1", aliases: ["t1", "test"],
        desc: "Description",
        extdesc: ["Parameters:",
            ["None Lol"]
        ],
        func: async (bot: Bot, ctx: Context) => await ctx.send("t1"),
        check: async (bot: Bot, ctx: Context): Promise<boolean> => true,
        cmds: [{
            name: "Test2", aliases: ["t2"],
            func: async (bot: Bot, ctx: Context) => await ctx.send("t2"),
            check: async (bot: Bot, ctx: Context): Promise<boolean> => false    ,
            cmds: [{
                name: "Test3", aliases: ["t3"],
                func: async (bot: Bot, ctx: Context) => await ctx.send("t3")
            }]
        }]
    }]
}
