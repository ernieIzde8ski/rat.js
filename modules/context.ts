import { APIMessageContentResolvable, Message, MessageOptions, MessageAdditions } from "discord.js";
import { Bot } from "../bot";
import { BadCommandError } from "./errors";


export class Context {
    invoked_with: string;
    message: Message;
    command: string | undefined;
    arguments: string[];
    flags: any;


    constructor( prefix: string, message: Message) {
        this.message = message;
        this.invoked_with = prefix;

        let __args__: string;
        let __flags__: string[];
        [__args__, ...__flags__] = this.message.content.slice(this.invoked_with.length).split(/\s*--/);
        this.arguments = __args__.split(" ");
        this.command = this.arguments.shift();
        if (this.command === "") throw new BadCommandError();

        this.flags = {};
        for (var i of __flags__) {
            let [key, ...values] = i.split(/\s+/);
            let value = values.join(" ");

            if (value === "") this.flags[key] = true;
            else {
                try {
                    this.flags[key] = JSON.parse(value);
                } catch (e) {
                    this.flags[key] = value;
                }
            }
        }

    }

    async send(content: APIMessageContentResolvable | (MessageOptions & {split?: false;}) | MessageAdditions) {
        await this.message.channel.send(content)
    }

    toString(): string {
        // console.log(this);
        return `Message ID: ${this.message.id}\nPrefix: ${this.invoked_with}\nCommand: ${this.command}\nArguments: ${JSON.stringify(this.arguments)}\nFlags: ${JSON.stringify(this.flags)}`;
    }

    clone(): Context {
        return new Context(this.invoked_with, this.message);
    }
}
