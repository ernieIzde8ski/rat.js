const { cleanArgsExist } = require("./checks");
const fetch = require("node-fetch");

const url = "https://bible-api.com/";
const urlRandom = "https://labs.bible.org/api/?passage=random&type=json";

getVerse = async (reference = "John 3:16", translation = "KJV") => {
    var resp = await fetch(`${url}${reference}?translation=${translation}`);
    resp = await resp.json();
    if (resp.error) return { error: resp.error };
    else if (typeof resp == "string") return { error: resp };
    else return {
        url: `https://www.biblegateway.com/passage/?search=${resp.reference.replace(/ /g, "%20")}`,
        ref: resp.reference,
        text: resp.text,
        translation: resp.translation_name
    };
};

getRandomVerse = async (translation = "KJV") => {
    var resp = await fetch(urlRandom);
    resp = (await resp.json())[0];
    var reference = `${resp.bookname} ${resp.chapter}:${resp.verse}`;
    resp = await getVerse(reference, translation);
    return resp;
};

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
};

handleVerse = (msg, resp) => {
    if (resp.error) {
        msg.channel.send(`error: ${resp.error}`); return;
    } else if (resp.text.length > 1000) {
        msg.channel.send(`error: too long\nthis link might work: <${resp.url}>`); return;
    }

    msg.channel.send({ embed: embedConstructor(resp) });
};

module.exports = {
    "name": ["bibleVerse", "verse", "v", "🙏"],
    "desc": "Return a bible verse",
    "desc_ext": [
        "expected format is <Book> <Chapter>:<Verse>",
        [
            "valid tags: --t, --translation",
            "valid options include: KJV (default, English), Cherokee (Cherokee), WEB (English)",
            "Clementine (Latin), Almeida (Portuguese), or RCCV (Romanian)",
        ].join("\n    ")
    ],
    "checks": cleanArgsExist,
    "func": (msg, args) => {
        var translation = "KJV";
        if (msg.tags.t) {
            translation = String(msg.tags.t);
        } else if (msg.tags.translation) {
            translation = String(msg.tags.translation);
        }

        getVerse(args.join(" "), translation).then(resp => handleVerse(msg, resp));
    },
    cmds: [{
        "name": ["random", "r"],
        "desc": "Return a random bible verse",
        "desc_ext": ["Although the same language options are available as the normal command,",
                     "issues are *very* likely to occur with non-English selections"],
        "func": (msg, args) => {
            var translation = "KJV";
            if (msg.tags.t) {
                translation = String(msg.tags.t);
            } else if (msg.tags.translation) {
                translation = String(msg.tags.translation);
            }

            getRandomVerse(translation)
                .then(resp => handleVerse(msg, resp));
        }
    }]
};