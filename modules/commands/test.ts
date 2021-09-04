import { Bot } from "../../bot";
import { Context } from "../context";

module.exports = {
    cmds: [{
        name: "Test1",
        aliases: ["t1"],
        desc: "Description",
        extdesc: ["Parameters:",
            ["None Lol"]
        ],
        func: async (bot: Bot, ctx: Context) => {
            await ctx.send("t1");
        },
        cmds: [
            {
                name: "Test2",
                aliases: ["t2"],
                func: async (bot: Bot, ctx: Context) => {
                    await ctx.send("t2");
                },
                cmds: [
                    {
                        name: "Test3",
                        aliases: ["t3"],
                        func: async (bot: Bot, ctx: Context) => {
                            await ctx.send("t3");
                        }
                    }
                ]
            }
        ]
    }]
}