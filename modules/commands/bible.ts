import { Client, Context } from "../commands";
import { get_passage } from "not_enough_bibles";


module.exports = {
    cmds: [{
        name: "verse", aliases: ["text", "v"],
        func: async (bot: Client, ctx: Context) => {
            const options = { translation: ctx.flags.translation ?? "KJV", processText: true, maxChars: ctx.flags.chars ?? 50 }
            const resp = await get_passage(ctx.args.join(" "), options);
            const embed = {
                title: resp.reference, description: "```\n" + resp.text + "\n```", color: ctx.self.displayColor,
                url: `https://www.biblegateway.com/passage/?search=${resp.reference.replace(" ", "%20")}&version=NIV`,
                footer: { text: `Translation: ${resp.translation_id}` }
            }
            await ctx.send({ embed: embed })
        }
    }]
}
