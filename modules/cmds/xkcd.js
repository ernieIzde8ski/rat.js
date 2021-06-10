const fetch = require("node-fetch");
var latest;
fetch("https://xkcd.com/info.0.json")
    .then(resp => resp.json())
    .then(json => latest = json.num)

// Command check
isRealXKCD = (app, msg, args) => {
    if (!args.length) return false;
    if (!parseInt(args[0])) return false;
    var id = parseInt(args[0]);
    return (1 <= id) && (id != 404) && (id <= latest)
}


randomXKCD = () => {
    var is_real = false
    var int = 0;
    while (is_real == false) {
        int = Math.ceil(Math.random() * latest);
        is_real = isRealXKCD("", "", [int])
    }
    return `https://xkcd.com/${int}`
}

module.exports = {
    "name": ["xkcd", "x"],
    "desc": "Return an xkcd from an integer",
    "func": (msg, args) => msg.channel.send(`https://xkcd.com/${args[0]}`),
    "checks": [isRealXKCD],
    "cmds": [{
            "name": ["random", "r"],
            "desc": "Returns a random xkcd",
            "func": (msg, args) => msg.channel.send(randomXKCD())
        },
        {
            "name": ["latest", "l"],
            "desc": "Returns the latest xkcd",
            "func": (msg, args) => msg.channel.send(`https://xkcd.com/${latest}`)
        }
    ]

}