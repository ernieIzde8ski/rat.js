// returns a message object with tags as a property
const setTags = async (msg, tags) => {
    msg.tags = {};
    if (tags.length) {
        for (var tag of tags) {
            [tag, property] = await parseTag(tag);
            msg.tags[tag] = property;
        }
    }
    return msg;
};

// returns a tag & the property to set it to
const parseTag = async (tag) => {
    match = tag.match(/:|=/);
    if (!match) {
        return [tag, true];
    } else {
        [tag, property] = tag.split(/:|=/, 2);
        try {
            property = JSON.parse(property.toLowerCase());
        } catch (e) {}
        return [tag, property];
    }
};

module.exports = setTags;