import { Bot, Context } from "../commands";
import axios from "axios";


type XCKDResp = { month: string, num: string, link: string, year: string, news: string, safe_title: string, transcript: string, alt: string, img: string, title: string, day: string };
async function get_xkcd(index: number): XKCDResp {
    const url = `https://xkcd.com/${index}/info.0.json`;
    const resp: AxiosResponse<XKCDResp> = await axios.get(url);
    return {url, title: resp.data.safe_title, image: resp.data.img, index: resp.data.num, alt: resp.data.alt};
}


module.exports = [
    cmds: [{
        name: "xkcd", aliases: ["XKCD"],
        func: async (bot: Bot, ctx: Context) => {
            const resp = await get_xkcd(ctx.args.shift() ?? 221);
            const embed = {title: resp.title, footer: resp.alt, color: ctx.self.displayColor, url: resp.url}
            await ctx.send({embed: embed});
        }
    }]
]
