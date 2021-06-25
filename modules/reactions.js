const reactions = {
    "troll": 846670001691557938n,
    "cirnge": "🇦🇲"
};

module.exports = async (msg = {}) => {
    var matches = msg.content.toLowerCase().match(/troll|cirnge/g);
    if (!matches) return;
    for (var match of matches) {
        var emoji = reactions[match];
        if (typeof emoji == "bigint");
            emoji = `:${match}:${emoji}`;
        msg.react(emoji);
    }
};