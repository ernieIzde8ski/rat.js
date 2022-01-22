import { CommandModule } from "../commands";
import { getPassage } from "not_enough_bibles";


// TODO: Fix seemingly backend issue from NEB
const Bible: CommandModule = {
    cmds: [{
        name: "verse", aliases: ["text", "v"],
        func: async (bot, ctx) => {
            const options = { translation: ctx.flags.translation ?? "KJV", processText: true, maxChars: ctx.flags.chars ?? 50 };
            const resp = await getPassage(ctx.args.join(" "), options);
            const embed = {
                title: resp.reference, description: "```\n" + resp.text + "\n```", color: ctx.self.displayColor,
                url: `https://www.biblegateway.com/passage/?search=${resp.reference.replace(" ", "%20")}&version=NIV`,
                footer: { text: `Translation: ${resp.translation_id}` }
            }
            await ctx.send({ embed: embed });
        }
    }]
}


module.exports = Bible;
