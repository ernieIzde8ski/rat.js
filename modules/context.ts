import { APIMessageContentResolvable, Message, MessageOptions, MessageAdditions } from "discord.js";
import { BadCommandError } from "./errors";


export function context_from_message(prefix: string, message: Message): Context {
    let __args__: string;
    let __flags__: string[];
    [__args__, ...__flags__] = message.content.slice(prefix.length).split(/\s*--/);
    let args = __args__.split(" ");
    let command = args.shift();
    if (command === "") throw new BadCommandError();

    let flags: any = {};
    for (var i of __flags__) {
        let [key, ...values] = i.split(/\s+/);
        let value = values.join(" ");

        if (value === "") flags[key] = true;
        else {
            try {
                this.flags[key] = JSON.parse(value);
            } catch (e) {
                this.flags[key] = value;
            }
        }
    }
    return new Context(prefix, message, command, args, flags)
}


export class Context {
    constructor(
        public invoked_with: string, public message: Message, public command: string, public args: string[], public flags: any
    ) { }

    async send(content: APIMessageContentResolvable | (MessageOptions & { split?: false; }) | MessageAdditions) {
        await this.message.channel.send(content)
    }

    toString(): string {
        return `Message ID: ${this.message.id}\nPrefix: ${this.invoked_with}\nCommand: ${this.command}\nArguments: ${JSON.stringify(this.args)}\nFlags: ${JSON.stringify(this.flags)}`;
    }

    clone(): Context {
        return new Context(this.invoked_with, this.message, this.command, this.args, this.flags);
    }
}
