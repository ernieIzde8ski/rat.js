
// straightforward
const removePrefix = (prefix = "", string = "") => {
    if (string.startsWith(prefix)) return string.slice(prefix.length);
    else return string;
};

// I only vaguely understand this code anymore
const parse = async (app, cmds, command, args, msg, tags) => {
    var command_parsed = false;
    cmds = cmds.filter(cmd => cmd.name.includes(command));
    for (cmd of cmds) {
        // only evaluate if there are no subcommands or no subcommand/parameter is specified
        if (!cmd.cmds || !args.length) {
            command_parsed = await execute(app, cmd, args, msg, tags);
        } else {
            var args_ = args;
            var command_ = args_.shift().toLowerCase();
            command_parsed = parse(app, cmd.cmds, command_, args_, msg, tags)
            if (!command_parsed) {
                command_parsed = await execute(app, cmd, args, msg, tags);
            };
        };
    };
    return command_parsed
}

// execute a command & return True
const execute = async (app, cmd, args, msg, tags) => {
    msg = await setTags(msg, tags)
    if (cmd.checks) {
        var failed_checks = cmd.checks.filter(check => !check(app, msg, args))
        failed_checks = failed_checks.map(check => "`" + removePrefix("checks.", check.name) + "`")
        if (failed_checks.length) {
            msg.channel.send(`error: failed the following check(s): ${String(failed_checks).replace(",", ", ")}`);
            return true;
        };
    }
    cmd.func(msg, args);
    return true;
};

// returns a message object with tags as a property
const setTags = async (msg, tags) => {
    msg.tags = {}
    if (tags.length) {
        for (tag of tags) {
            [tag, property] = await parseTag(tag);
            msg.tags[tag] = property;
        };
    };
    return msg;
};

// returns a tag & the property to set it to
const parseTag = async (tag) => {
    match = tag.match(/:|=/)
    if (!match) {
        return [tag, true];
    } else {
        [tag, property] = tag.split(/:|=/, 2);
        try {
            property = JSON.parse(property.toLowerCase())
        } catch (e) {};
        return [tag, property];
    };
};

module.exports = parse