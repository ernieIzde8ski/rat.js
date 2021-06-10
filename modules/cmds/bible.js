const checks = require("./checks")
const fetch = require("node-fetch");

get_verse = async (reference = "John 3:16") => {
    var url = "https://bible-api.com/";
    const response = await fetch(`${url}${reference}`);
    const data = await response.json();
    if (data.error) return {
        "url": null,
        "ref": `error: ${data.error}`,
        "text": "Try Again Lol"
    };
    else return {
        "url": `https://www.biblegateway.com/passage/?search=${data.reference.replace(/ /g, "%20")}`,
        "ref": data.reference,
        "text": data.text
    }
}

module.exports = {
    "name": ["bible_verse", "verse", "v", "🙏"],
    "desc": "Return a bible verse",
    "desc_ext": "usual format is <Book> <Chapter>:<Verse>",
    "func": (msg, args) => {
        var arg = args.join(" ")
        get_verse(args.join(" ")).then(text => {
            if (text.text.length > 1000) {
                msg.channel.send(`Too long\nthis link might work: ${text.url}`);
                return;
            };
            var message = `**${text.ref}**\n`;
            message += `>>> ${text.text}`;
            msg.channel.send(message);
        });
    },
    "checks": [checks.argsExist]
}
