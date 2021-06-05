const sr = require('seedrandom')

var seed = "";
module.exports = seed => {
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