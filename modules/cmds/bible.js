const {
    argsExist
} = require("./checks");
const fetch = require("node-fetch");

get_verse = async (reference = "John 3:16", translation = "KJV") => {
    var url = "https://bible-api.com/";
    const response = await fetch(`${url}${reference}?translation=${translation}`);
    const data = await response.json();
    if (data.error) return { error: data.error };
    else if (typeof data == "string") return { error: data };
    else return {
        url: `https://www.biblegateway.com/passage/?search=${data.reference.replace(/ /g, "%20")}`,
        ref: data.reference,
        text: data.text,
        translation: data.translation_name
    }
}

embedConstructor = resp => {
    embed = {
        title: resp.ref,
        url: resp.url,
        description: resp.text,
        footer: {
            text: `Translation: ${resp.translation}`
        }
    };
    return embed;
}

module.exports = {
    "name": ["bible_verse", "verse", "v", "🙏"],
    "desc": "Return a bible verse",
    "desc_ext": [
        "usual format is <Book> <Chapter>:<Verse>",
        [
            "valid tags: --t, --translation",
            "valid options include: KJV (default, King James Version), Cherokee (Cherokee New Testament),",
            "WEB (World English Bible), Clementine (Clementine Latin Vulgate), Almeida (Portuguese,",
            "\"João Ferreira de Almeida\"), or RCCV (Romanian Corrected Cornilescu Version)"
        ].join("\n   ")
    ],
    "checks": argsExist,
    "func": (msg, args) => {
        var translation = "KJV";
        if (msg.tags.t) {
            translation = String(msg.tags.t);
        } else if (msg.tags.translation) {
            translation = String(msg.tags.translation);
        };

        get_verse(args.join(" "), translation).then(text => {
            if (text.error) {
                msg.channel.send(`error: ${text.error}`); return;
            } else if (text.text.length > 1000) {
                msg.channel.send(`error: too long\nthis link might work: <${text.url}>`); return;
            };

            msg.channel.send({
                embed: embedConstructor(text)
            })
        });
    }
}