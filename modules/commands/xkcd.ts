import { Client, Context } from "../commands";
import axios, { AxiosResponse } from "axios";


type RawXKCDResp = { month: string, num: number, link: string, year: string, news: string, safe_title: string, transcript: string, alt: string, img: string, title: string, day: string };
type XKCDResp = { url: string, title: string, image: string, index: number, alt: string };


async function get_xkcd(index: number): Promise<XKCDResp> {
    const url = `https://xkcd.com/${index}/info.0.json`;
    const resp: AxiosResponse<RawXKCDResp> = await axios.get(url);
    return { url, title: resp.data.safe_title, image: resp.data.img, index: resp.data.num, alt: resp.data.alt };
}


module.exports = {
    cmds: [{
        name: "xkcd", aliases: ["XKCD"],
        func: async (bot: Client, ctx: Context) => {
            const number = Number(ctx.args.shift())
            const resp = await get_xkcd(number ? number : 221);
            const embed = { title: resp.title, footer: { text: resp.alt }, color: ctx.self.displayColor, url: resp.url };
            await ctx.send({ embed });
        }
    }]
}
