import { Message } from "discord.js";
import { Context } from "./context";

export async function parse_command(message: Message, prefix: string): Promise<void> {
    if (!message.content.startsWith(prefix)) return;
    let context = new Context(message, prefix);
    message.channel.send("Context: \n``` CONTEXT \n```".replace("CONTEXT", context.toString))
}