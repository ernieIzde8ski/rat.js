wrap = resp => "```resp```".replace("resp", resp);

get_spaces = cmds => {
    var max_spaces = 0;
    cmds.forEach(cmd => {
        len = cmd.name[0].length
        if (len > max_spaces) max_spaces = len;
    })
    return max_spaces + 2
};

defaultHelp = (msg, cmds, prefix) => {
    var resp = "";
    if (!msg.tags.showAll) cmds = cmds.filter(cmd => !cmd.hidden);
    var max_spaces = get_spaces(cmds);
    for (cmd of cmds) {
        spaces = " ".repeat(max_spaces - cmd.name[0].length);
        resp += `\n${cmd.name[0]}:${spaces}${cmd.desc}`
    };
    resp += `\n\nType ${prefix}help for this message.`;
    resp += `\nYou can also type ${prefix}help <command> for more information on a command.`;
    return wrap(resp);
}

commandHelp = (msg, cmds, prefix, args) => {
    var resp = "";

    cmd = get_command(cmds, args)
    if (cmd.error) return `error: ${cmd.error}`

    resp += `\n${prefix}${cmd.path}[${cmd.name}]\n`;
    resp += `\n${cmd.desc}`;
    if (cmd.desc_ext) resp += `\n${cmd.desc_ext}`;

    if (cmd.cmds) {
        if (!msg.tags.showAll) cmd.cmds = cmd.cmds.filter(subcmd => !subcmd.hidden);
        var max_spaces = get_spaces(cmd.cmds)
        resp += "\n\nSubcommands:"
        for (subcmd of cmd.cmds) {
            var spaces = " ".repeat(max_spaces - subcmd.name[0].length)
            resp += `\n  ${subcmd.name[0]}:${spaces}${subcmd.desc}`
        }
    };

    if (cmd.checks) {
        resp += "\n\nChecks: "
        resp += cmd.checks.map(check => check.name).join(", ")
    }

    return wrap(resp);
};

get_command = (cmds, args, path = "") => {
    arg = args.shift().toLowerCase()
    cmds = cmds.filter(cmd => cmd.name.includes(arg))

    // if no commands present
    if (!cmds.length) return {
        "error": "could not find that command",
    };
    // if too many commands present
    else if (cmds.length > 1) return {
        "error": `internal error; multiple commands named ${arg}`
    };

    cmd = cmds[0]
    cmd.path = path
    // if no more arguments to evaluate
    if (!args.length) return cmd;
    // if more arguments to evaluate
    else {
        path += cmd.name[0] + " ";
        // if no more subcommands to evaluate
        if (!cmd.cmds) return {
            "error": `${cmd.name[0]} has no subcommands`
        };
        // if more subcommands to evaluate
        return get_command(cmd.cmds, args, path)
    }
};


module.exports = (args, msg, cmds, prefix) => {
    if (typeof prefix == "object") prefix = prefix[0];
    var respuesta = "";
    if (!args.length) respuesta = defaultHelp(msg, cmds, prefix);
    else respuesta = commandHelp(msg, cmds, prefix, args);
    msg.channel.send(respuesta);
}