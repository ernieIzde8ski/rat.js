import { Bot } from "../../bot";
import { Context } from "../context";

module.exports = {
    "cmds": [
        {
            name: "help",
            aliases: ["commands", "cmds"],
            desc: "Shows support information", 
            func: async (bot: Bot, ctx: Context) => {
                let command_max_length = 0;
                for (var command of bot.commands.array) {
                    if (command.name.length > command_max_length)
                        command_max_length = command.name.length;
                }
                command_max_length += 4;

                let current_group = undefined;
                let resp = "```\n";
                for (var command of bot.commands.array) {
                    if (command.group !== current_group) {
                        current_group = command.group;
                        resp += (current_group + ":\n");
                    }
                    resp += ("   " + command.name)
                    if (command.desc !== "") {
                        var spaces = " ".repeat(command_max_length - command.name.length);
                        resp += (spaces + command.desc);
                    };
                    resp += "\n";
                }
                resp += "\nType '{PREFIX}help command' for more information on a command.\n"
                resp += "```"
                await ctx.send(resp.replace("{PREFIX}", ctx.invoked_with))
            }
        }
    ]
}