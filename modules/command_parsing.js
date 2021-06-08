// straightforward
const removePrefix = (prefix = "", string = "") => {
    if (string.startsWith(prefix)) return string.slice(prefix.length);
    else return string;
};

// execute a command & return True
const execute = async (app, cmd, args, msg) => {
    if (cmd.checks) {
        var failed_checks = cmd.checks.filter(check => !check(app, msg, args))
        failed_checks = failed_checks.map(check => "`" + removePrefix("checks.", check.name) + "`")
        if (failed_checks.length) {
            msg.channel.send(`error: failed the following check(s): ${String(failed_checks).replace(",", ", ")}`)
            return true
        };
    }
    cmd.func(args, msg);
    return true;
};

// I only vaguely understand this code anymore
const parse = async (app, cmds, command, args, message) => {
    var command_parsed = false
    for (cmd of cmds.filter(cmd => cmd.name.includes(command))) {
        // only evaluate if there are no subcommands or no subcommand/parameter is specified
        if (!cmd.cmds || !args.length) {
            command_parsed = await execute(app, cmd, args, message);
        } else {
            var args_ = args;
            var command_ = args_.shift().toLowerCase();
            command_parsed = parse(app, cmd.cmds, command_, args_, message)
            if (!command_parsed) {
                command_parsed = await execute(app, cmd, args, message);
            };
        };
    };
    return command_parsed
}

module.exports = parse