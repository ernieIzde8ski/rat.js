import { Client } from "@typeit/discord";
import { APIMessageContentResolvable, ClientApplication, Message, MessageAdditions, MessageOptions, } from "discord.js";
import { BadCommandError } from "./errors";


export class Bot {
    client: Client;
    application: ClientApplication;

    constructor(public configs: { prefix: string, trigger: string }, public commands?: Commands) {
        this.client = new Client({
            classes: [
                `${__dirname}/*Discord.ts`,
            ],
            silent: false,
            variablesChar: ":",
        });

    }

    async start(token: string): Promise<void> {
        await this.client.login(token)
        this.application = await this.client.fetchApplication();
    }

}

function group_to_titlecase(group: string): string {
    return group.replace("_", " ").split(/\s+/).filter(str => str.length).map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");
}

export type RawCommand = {
    name: string,
    aliases?: string[],
    func: Function,
    desc?: string,
    extdesc?: ExtendedDescription,
    cmds?: RawCommand[]
}

type raw_command_group = { cmds: RawCommand[], name?: string, initialize?: Function };

export function file_to_command_group(path: string): Commands {
    const resp = new Commands();
    const key = require.resolve(`./commands/${path}`);
    if (require.cache[key] !== undefined) delete require.cache[key];
    const group: raw_command_group = require(`./commands/${path}`);
    if (group.name === undefined) group.name = group_to_titlecase(path);
    if (group.initialize !== undefined) group.initialize();
    for (var raw_command of group.cmds) {
        let command = new Command(group.name, path, [], raw_command);
        resp.push(command);
    }
    return resp;
}


type ExtendedDescription = Array<string | ExtendedDescription>;


export class Command {
    name: string;
    names: Set<string>;
    desc: string;
    extdesc: string;
    func: Function;
    cmds: Commands;

    constructor(public group: string, public fp: string, public parents: string[], raw_command: RawCommand) {
        this.name = raw_command.name;
        this.names = new Set(raw_command.aliases ? raw_command.aliases : []).add(this.name);
        this.desc = (typeof raw_command.desc === "string") ? raw_command.desc : ""
        this.extdesc = (typeof raw_command.extdesc === "object") ? Command.extdesc_constructor(raw_command.extdesc) : ""
        this.func = raw_command.func


        this.cmds = new Commands();
        if (raw_command.cmds !== undefined) {
            var ancestry = this.parents.concat(this.name);
            for (var cmd of raw_command.cmds) {
                this.cmds.push(new Command(group, fp, ancestry, cmd));
            }
        }
    }

    private static extdesc_constructor(extdesc: ExtendedDescription, indent: number = 0): string {
        let spaces = " ".repeat(indent)
        extdesc = extdesc.map(value => {
            if (typeof value === "object")
                value = this.extdesc_constructor(value, indent + 2);
            return spaces + value;
        })
        return extdesc.join("\n")

    }
}

export class Commands extends Array<Command> {
    /** Shorthand for `this.sort((a, b) => a.group.toLowerCase().localeCompare(b.group.toLowerCase()))`. */
    asort() {
        this.sort((a, b) => a.group.toLowerCase().localeCompare(b.group.toLowerCase()))
    }

    names(): string[] {
        return this.map(command => command.name)
    }

    get(ctx: Context): Command | null {
        // Filter commands with matching names
        let cmds = this.filter(cmd => cmd.names.has(ctx.command));
        // Iterate until a match is found.
        for (var cmd of cmds) {
            // Pass these commands if context flags specify to.
            if (ctx.flags.no_subcommands && cmd.parents === []) {
                return null;
            }
            // Return if there are no more arguments or subcommands to parse.
            if (!ctx.args.length || !cmd.cmds.length) return cmd;
            // Check for subcommands.
            let ctx_1 = ctx.clone();
            ctx_1.command = ctx_1.args.shift();
            let subcmd = cmd.cmds.get(ctx_1);
            // Return the subcommand if it exists.
            let resp = (subcmd === null) ? cmd : subcmd;
            console.log(resp)
            return resp;
        }
        // Return when no commands are matched.
        return null
    }
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
