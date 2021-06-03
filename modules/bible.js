const fetch = require('node-fetch');

modules.exports = async (reference = "John 3:16") => {
    var url = "https://bible-api.com/";
    const response = await fetch(`${url}${reference}`);
    const data = await response.json();
    if (data.error) return {
        "url": null,
        "ref": `error: ${data.error}`,
        "text": "Try Again Lol"
    };
    else return {
        "url": `https://www.biblegateway.com/passage/?search=${data.reference}`,
        "ref": data.reference,
        "text": data.text.replace()
    }
}
