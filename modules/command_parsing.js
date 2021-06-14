// straightforward
const removePrefix = (prefix = "", string = "") => {
    if (string.startsWith(prefix)) return string.slice(prefix.length);
    else return string;
};

// I only vaguely understand this code anymore
const parse = async (app, cmds, command, args, msg) => {
    var commandParsed = false;
    cmds = cmds.filter(cmd => cmd.name.includes(command));
    for (cmd of cmds) {
        // only evaluate if there are no subcommands, no subcommand/parameter is specified,
        // or subcommands are disallowed
        if (!cmd.cmds || !args.length || msg.tags.noSubcommands || msg.tags.nsc) {
            commandParsed = await execute(app, cmd, args, msg);
        } else {
            var args_ = args.map(x => x);
            var command_ = args_.shift().toLowerCase();
            commandParsed = await parse(app, cmd.cmds, command_, args_, msg)
            if (!commandParsed) {
                commandParsed = await execute(app, cmd, args, msg);
            };
        };
    };
    return commandParsed
}

// execute a command & return True
const execute = async (app, cmd, args, msg) => {
    if (cmd.checks) {
        if (typeof cmd.checks == "function") cmd.checks = [cmd.checks];
        var failedChecks = cmd.checks.filter(check => !check(app, msg, args))
        failedChecks = failedChecks.map(check => "`" + removePrefix("checks.", check.name) + "`")
        if (failedChecks.length) {
            msg.channel.send(`error: failed the following check(s): ${failedChecks.join(", ")}`);
            return true;
        };
    }
    cmd.func(msg, args);
    return true;
};

module.exports = parse