import { Client } from "@typeit/discord";
import { APIMessageContentResolvable, ClientApplication, Message, MessageAdditions, MessageOptions, } from "discord.js";
import { BadCommandError } from "./errors";

/**
 * Extension of Discord client.
 */
export class Bot extends Client {
    application: ClientApplication;

    constructor(public configs: { prefix: string, trigger: string }, public commands?: Commands) {
        super({ classes: [`${__dirname}/*Discord.ts`], silent: false, variablesChar: ":" })
    }

    /**
     * Actually log in. Also initializes `application`.
     * @param token Discord bot application token.
     */
    async start(token: string): Promise<void> {
        await this.login(token)
        this.application = await this.fetchApplication();
    }
}

/** Converts a command group's filepath to a titlecased string. */
function group_to_titlecase(group: string): string {
    return group.replace("_", " ").split(/\s+/).filter(str => str.length).map(str => str[0].toUpperCase() + str.slice(1).toLowerCase()).join(" ");
}

/** Format which command file exports follow. */
type raw_command_group = { cmds: RawCommand[], name?: string, initialize?: Function };

/** Format which commands in command files follow. */
export type RawCommand = {
    name: string,
    aliases?: string[],
    func: Function,
    desc?: string,
    extdesc?: ExtendedDescription,
    check?: Function,
    cmds?: RawCommand[]
};

/** Recursive array of strings */
type ExtendedDescription = Array<string | ExtendedDescription>;

/** Converts a command file to a Commands class. */
export function file_to_command_group(path: string): Commands {
    const resp = new Commands();
    // Delete a file's cached value if it's already been loaded.
    // This allows for editing a command and reloading it while the bot is still running.
    const key = require.resolve(`./commands/${path}`);
    if (require.cache[key] !== undefined) delete require.cache[key];
    // Load the file.
    const group: raw_command_group = require(`./commands/${path}`);
    if (group.name === undefined) group.name = group_to_titlecase(path);
    if (group.initialize !== undefined) group.initialize();
    // Convert each command to Command and append to resp.
    for (var raw_command of group.cmds) {
        resp.push(new Command(group.name, path, [], raw_command));
    }
    return resp;
}

/** Command that can be processed by the bot. */
export class Command {
    name: string;
    names: Set<string>;
    desc: string;
    extdesc: string;
    func: Function;
    cmds: Commands;
    parents: string;
    check: Function

    constructor(public group: string, public fp: string, parents: string[], raw_command: RawCommand) {
        this.name = raw_command.name;
        this.names = new Set(raw_command.aliases ? raw_command.aliases : []).add(this.name);
        this.desc = (typeof raw_command.desc === "string") ? raw_command.desc : "";
        this.extdesc = (typeof raw_command.extdesc === "object") ? Command.extdesc_constructor(raw_command.extdesc) : "";
        this.check = (raw_command.check === undefined) ? async (a: Bot, b: Context) => true : raw_command.check;
        this.func = raw_command.func;
        this.parents = parents.join(" ");

        this.cmds = new Commands();
        if (raw_command.cmds !== undefined) {
            const ancestry = parents.concat(this.name);
            for (var cmd of raw_command.cmds) {
                this.cmds.push(new Command(group, fp, ancestry, cmd));
            }
        }
    }

    /** Converts ExtendedDescription type to string. */
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

/** Array of Command. */
export class Commands extends Array<Command> {
    /** Shorthand for `this.sort((a, b) => a.group.toLowerCase().localeCompare(b.group.toLowerCase()))`. */
    asort() {
        this.sort((a, b) => a.group.toLowerCase().localeCompare(b.group.toLowerCase()))
    }

    /** Yeah so like Apparently Array.filter just Doesn't support asynchronous functions */
    async asyncFilter(callbackfn: (value: Command, index: number, array: Command[]) => unknown): Promise<Command[]> {
        const results = await Promise.all(this.map(callbackfn));
        return this.filter((v, index) => results[index])
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
            if (ctx.flags.no_subcommands && cmd.parents === "") {
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

/** Context passed to all invocations of Command. */
export class Context {
    constructor(
        public invoked_with: string, public message: Message, public command: string, public args: string[], public flags: any
    ) { }
    
    /** Shorthand for Context.message.channel.send. */
    async send(content: APIMessageContentResolvable | (MessageOptions & { split?: false; }) | MessageAdditions): Promise<Message> {
        return await this.message.channel.send(content)
    }

    /** Returns some basic information about the invocation context. */
    toString(): string {
        return `Message ID: ${this.message.id}\nPrefix: ${this.invoked_with}\nCommand: ${this.command}\nArguments: ${JSON.stringify(this.args)}\nFlags: ${JSON.stringify(this.flags)}`;
    }

    /** Creates new identical Context class. */
    clone(): Context {
        return new Context(this.invoked_with, this.message, this.command, this.args, this.flags);
    }
}

/** Generates the Context for a Message. */
export function context_from_message(prefix: string, message: Message): Context {
    // Split arguments at first instance of --, create command & args variables.
    let [__args__, ...__flags__] = message.content.slice(prefix.length).split(/\s*--/);
    let args = __args__.split(" ");
    let command = args.shift();
    if (command === "") throw new BadCommandError();

    // Generate flag values.
    let flags: any = {};
    for (var i of __flags__) {
        // Splits up each flag into a key and value. This also kinda just eliminates extra whitespace,
        // I hope no one misses that.
        let [key, ...values] = i.split(/\s+/);
        let value = values.join(" ");

        // Attempt to parse the value.
        if (value === "") flags[key] = true;
        else {
            try {
                this.flags[key] = JSON.parse(value);
            } catch (e) {
                this.flags[key] = value;
            }
        }
    }
    return new Context(prefix, message, command, args, flags);
}
