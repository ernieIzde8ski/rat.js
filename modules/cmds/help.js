var spaces = "";

wrap = resp => "```resp```".replace("resp", resp);

default_help = (cmds, prefix) => {
    var resp = "";
    cmds = cmds.filter(cmd => !cmd.hidden)
    var max_spaces = get_spaces(cmds)
    cmds.forEach(cmd => {
        spaces = " ".repeat(max_spaces - cmd.name[0].length);
        resp += `\n${cmd.name[0]}:${spaces}${cmd.desc}`
    });
    resp += `\n\nType ${prefix}help for this message.`;
    resp += `\nYou can also type ${prefix}help <command> for more information on a command.`;
    return wrap(resp);
}

command_help = (cmds, prefix, args) => {
    var resp = "";

    c = get_command(cmds, args)
    if (c.error) return `error: ${c.error}`

    resp += `\n${prefix}${c.path}[${c.name}]\n`;
    resp += `\n${c.desc}`;
    if (c.desc_ext) resp += `\n${c.desc_ext}`;

    if (c.cmds) {
        var max_spaces = get_spaces(c.cmds)
        resp += "\n\nSubcommands:"
        var spaces = "";
        c.cmds.filter(cmd => !cmd.hidden).forEach(cmd => {
            spaces = " ".repeat(max_spaces - cmd.name[0].length)
            resp += `\n  ${cmd.name[0]}:${spaces}${cmd.desc}`
        })
    };

    if (c.checks) {
        resp += "\n\nChecks: "
        resp += String(c.checks.map(check => check.name)).replace(",", ", ")
    }

    return wrap(resp);
}

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
}

get_spaces = cmds => {
    var max_spaces = 0;
    cmds.forEach(cmd => {
        len = cmd.name[0].length
        if (len > max_spaces) max_spaces = len;
    })
    return max_spaces + 2
}

module.exports = {
    default_help: default_help,
    command_help: command_help,
}