const sr = require("seedrandom");
const { cleanArgsExist } = require("./checks");

bmResp = seed => {
    if (seed.includes("`")) seed = "Armenium";
    sr(seed.toLowerCase().replace(/[^\x00-\x7F]/g, ""), {global: true});
    var value = ["Cringe", "Based"][Math.floor(2 * Math.random())];
    var punctuation = ["!", "."][Math.floor(2 * Math.random())];
    punctuation = punctuation.repeat(Math.ceil(5 * Math.random()));
    return {
        "seed": seed,
        "value": value,
        "punc": punctuation
    }
}

module.exports = {
    "name": ["based_cringe_meter", "bm"],
    "desc": "Return judgement",
    "desc_ext": "Requires an argument",
    "func": (msg, args) => {
        if (!args.length) {
            msg.channel.send("**You** are **cringe!!!!!!!!!!**");
            return;
        };
        var resp = bmResp(args.join(" "));
        msg.channel.send(`**${resp.seed}** are **${resp.value}**${resp.punc}`)
    },
    "checks": cleanArgsExist
}