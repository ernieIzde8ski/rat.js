var spaces = "";

wrap = resp => "```resp```".replace("resp", resp);

default_help = (cmds, max_spaces, prefix) => {
    var resp = "";
    cmds.filter(cmd => !cmd.hidden).forEach(cmd => {
        spaces = " ".repeat(max_spaces - cmd.name[0].length);
        resp += `\n${cmd.name[0]}:${spaces}${cmd.desc}`
    });
    resp += `\n\nType ${prefix}help for this message.`;
    resp += `\nYou can also type ${prefix}help <command> for more information on a command.`;
    return wrap(resp);
}

command_help = (cmds, arg, prefix) => {
    var resp = "";
    cmd = cmds.filter(cmd => cmd.name.includes(arg))
    if (!cmd.length) return "That is not a valid command !!!!!!!";

    cmd = cmd[0]
    resp += `\n${prefix}[${cmd.name}]\n`;
    resp += `\n${cmd.desc}`;
    if (cmd.desc_ext) resp += `\n${cmd.desc_ext}`;
    
    return wrap(resp);
}

module.exports = {
    default_help: default_help,
    command_help: command_help,
}