import { Message } from "discord.js";
import { Context } from "./context";

export async function parse_command(message: Message, prefix: string): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    let ctx = new Context(message, prefix);
    let ctx_string = ctx.toString();
    message.channel.send("Context: \n```CONTEXT\n```".replace("CONTEXT", ctx_string))
}