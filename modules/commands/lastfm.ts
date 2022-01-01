import { AxiosResponse } from "axios";
import { CommandModule } from "../commands";
import { ArgumentParsingError } from "../errors";
import { LastFMRecentResponses } from "./lastfm-typings";


const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");


const LastFM: CommandModule = {
    cmds: [{
        name: "now_playing", aliases: ["fm", "np"],
        desc: "Gets the currently playing song of a user",
        func: async (bot, ctx) => {
            if (!ctx.args.length) ctx.args.push("Armenium");
            const user = ctx.args.shift();
            if (!letters.includes(user[0]) || user.replace(/[A-z0-9_-]/g, "").length) throw new ArgumentParsingError(`Last.fm username '${user}' is invalid.`);

            const resp: AxiosResponse<LastFMRecentResponses> = await bot.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=LASTFM&format=json`, ["lastfm"]);
            if ("error" in resp.data) throw new Error(resp.data.message);
            else {
                const track = resp.data.recenttracks.track[0];
                const embed = {
                    title: `Now Playing: ${track.name}`,
                    description: `**${track.album["#text"]}** | _${track.artist["#text"]}_`,
                    url: track.url,
                    author: {
                        name: user + (track["@attr"]?.nowplaying === "true" ? "'s current song" : "'s last song"),
                        icon_url: track.image[track.image.length - 1]["#text"]
                    }, timestamp: track.date ? new Date(track.date.uts) : new Date()
                };
                await ctx.send({ embed });
            }
        }
    }]
}


module.exports = LastFM;
