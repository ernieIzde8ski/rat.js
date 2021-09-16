import { Client, Context } from "../commands";

function random_song(arr: Array<string>): string {
    if (!arr?.length) return "7-iRf9AWoyE";
    return arr[Math.floor(arr.length * Math.random())];
}

module.exports = {
    cmds: [{
        name: "support", aliases: ["information", "info"], desc: "Provide support information",
        func: async (bot: Client, ctx: Context) => {
            const embed = {
                title: "Information & Support", color: ctx.self.displayColor,
                description: `[GitHub](${bot.configs.git})\n`
                    + `[${bot.user.username} Invite](https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=2214915137)\n`
                    + `[Server Invite](https://discord.gg/${bot.configs.invite})`,
                url: `https://youtu.be/${random_song(bot.configs.songs)}`
            };
            await ctx.send({ embed });
        }
    }, {
        name: "invite", aliases: ["inv"], desc: "Return the bot & server invites",
        func: async (bot: Client, ctx: Context) => {
            await ctx.send(`Server Invite: https://discord.gg/${bot.configs.invite}\nBot Invite: https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=2214915137`);
        }
    }]
}
