const {
    argsExist
} = require("./checks");
const fetch = require("node-fetch");

get_verse = async (reference = "John 3:16") => {
    var url = "https://bible-api.com/";
    const response = await fetch(`${url}${reference}`);
    const data = await response.json();
    if (data.error) return { "error": data.error };
    else if (typeof data == "string") return { "error": data };
    else return {
        "url": `https://www.biblegateway.com/passage/?search=${data.reference.replace(/ /g, "%20")}`,
        "ref": data.reference,
        "text": data.text,
        "translation": data.translation_name
    }
}

module.exports = {
    "name": ["bible_verse", "verse", "v", "🙏"],
    "desc": "Return a bible verse",
    "desc_ext": "usual format is <Book> <Chapter>:<Verse>",
    "func": (msg, args) => {
        get_verse(args.join(" ")).then(text => {
            if (text.error) {
                msg.channel.send(`error: ${text.error}`)
            } else if (text.text.length > 1000) {
                msg.channel.send(`error: Too long\nthis link might work: <${text.url}>`);
                return;
            };
            msg.channel.send({
                embed: {
                    url: text.url,
                    title: text.ref,
                    description: text.text,
                    footer: {
                        text: `Translation: ${text.translation}`
                    }
                }
            })
        });
    },
    "checks": argsExist
}