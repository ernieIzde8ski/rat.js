import { Context } from "./context";


type ExtendedDescription = Array<string | ExtendedDescription>;

export type RawCommand = {
    name: string,
    aliases: string[] | undefined,
    desc: string | undefined,
    extdesc: ExtendedDescription | undefined,
    func: Function,
    cmds: RawCommand[] | undefined
}


export class Command {
    name: string;
    names: string[];
    desc: string;
    extdesc: string;
    func: Function;
    cmds: Commands;

    constructor(public group: string, public parents: string[], raw_command: RawCommand) {
        this.name = raw_command.name;
        this.names = (raw_command.aliases.includes(this.name)) ? raw_command.aliases : raw_command.aliases.concat(this.name);
        this.desc = (typeof raw_command.desc === "string") ? raw_command.desc : ""
        this.extdesc = (typeof raw_command.extdesc === "object") ? Command.extdesc_constructor(raw_command.extdesc) : ""
        this.func = raw_command.func


        let cmds: Array<Command> = [];
        if (raw_command.cmds !== undefined) {
            var ancestry = this.parents.concat(this.name);
            for (var cmd of raw_command.cmds) {
                cmds.push(new Command(group, ancestry, cmd));
            }
        }
        this.cmds = new Commands(cmds)
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

export class Commands {

    constructor(public array: Command[] = []) {
    }

    sort() {
        this.array.sort((a, b) => a.group.toLowerCase().localeCompare(b.group.toLowerCase()))
    }

    push(command: Command): void {
        this.array.push(command);
    }

    names(): string[] {
        return this.array.map(command => command.name)
    }

    get(ctx: Context): Command | null {
        // Filter commands with matching names
        let cmds = this.array.filter(cmd => cmd.names.includes(ctx.command));
        // Iterate until a match is found.
        for (var cmd of cmds) {
            // Pass these commands if context flags specify to.
            if (ctx.flags.no_subcommands && cmd.parents === []) {
                return null;
            }
            // Return if there are no more arguments or subcommands to parse.
            if (!ctx.args.length || !cmd.cmds.array.length) return cmd;
            // Check for subcommands.
            let ctx_1 = ctx.clone();
            ctx_1.command = ctx_1.args.shift();
            let subcmd = cmd.cmds.get(ctx_1);
            // Return the subcommand if it exists.
            return (subcmd === null) ? cmd : subcmd
        }
        // Return when no commands are matched.
        return null



    }
}
