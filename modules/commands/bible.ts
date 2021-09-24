import { Client, Context } from "../commands";
import axios from "axios";
import { TranslationNotFound } from "../errors";
const twitterSplitter: ((text: string, limit: number, joiner: string) => string[]) = require("twitter-splitter");


type Verse = { book_id: string, book_name: string, chapter: number, verse: number, text: string };
type BibleResp = { reference: string, verses: Array<Verse>, text: string, translation_id: string, translation_name: string, translation_note: string };
type BibleResps = BibleResp | { error: string } | "translation not found";
type TextResp = { ref: string, text: string, translation: string };


const regex = /[&/?=]/gm
async function get_text(ref: string, translation: string = "kjv", characters_per_line: number = 100, display_verse: boolean = true): Promise<TextResp> {
    [ref, translation] = [ref.replace(regex, ""), translation.replace(regex, "")];
    const link = `https://bible-api.com/${ref}?translation=${translation}`;
    const data: BibleResps = (await axios.get(link)).data;
    if (typeof data === "string") throw new TranslationNotFound(translation);
    else if ("error" in data) throw new Error(data.error);

    if (!display_verse) var text = data.text.trim().replace(/\s+/g, " ");
    else var text = data.verses.map(verse => `${verse.verse} ` + verse.text.trim().replace(/\s+/g, " ")).join(" ");

    return { ref: data.reference, text: twitterSplitter(text, characters_per_line, "").join("\n"), translation }
}


module.exports = {
    cmds: [{
        name: "verse", aliases: ["text", "v"],
        func: async (bot: Client, ctx: Context) => {
            const resp = await get_text(ctx.args.join(" "), ctx.flags.translation ?? "kjv", (ctx.flags.characters ?? ctx.flags.characters_per_line) ?? 50, ctx.flags.display_verse ?? true)
            const embed = {
                title: resp.ref, description: "```\n" + resp.text + "\n```", color: ctx.self.displayColor,
                url: `https://www.biblegateway.com/passage/?search=${resp.ref.replace(" ", "%20")}&version=NIV`,
                footer: { text: `Translation: ${resp.translation}` }
            }
            await ctx.send({ embed: embed })
        }
    }]
}
