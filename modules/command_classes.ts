import { Context } from "./context";


export class Command {
    group: string;
    parents: string[];
    name: string;
    names: string[];
    desc: string;
    func: Function;
    cmds: Command[];

    constructor(group: string, parents: string[], raw_command: { name: string, aliases: string[], desc: string | undefined, func: Function, cmds: any[] | undefined }) {
        this.group = group;
        this.parents = parents;
        this.name = raw_command.name;
        this.names = (raw_command.aliases.includes(this.name)) ? raw_command.aliases : raw_command.aliases.concat(this.name);
        this.desc = (typeof raw_command.desc === "string") ? raw_command.desc : ""
        this.func = raw_command.func

        this.cmds = []
        if (raw_command.cmds !== undefined) {
            var ancestry = this.parents.concat(this.name);
            for (var cmd of raw_command.cmds) {
                this.cmds.push(new Command(group, ancestry, cmd));
            }
        }
    }
}
export class Commands {
    array: Command[]

    constructor() {
        this.array = [];
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

    get(ctx: Context, cmds: Command[] = this.array): Command | null {
        // All commands that 
        var cmds = cmds.filter(cmd => cmd.names.includes(ctx.command));
        for (var command of cmds) {
            if (!command.cmds || !ctx.arguments.length || ctx.flags.no_subcommands || ctx.flags.nsc) {
                return command;
            } else {
                var ctx_1 = ctx.clone();
                ctx_1.arguments.slice(command.parents.length);
                ctx_1.command = ctx_1.arguments.shift();
                var _command = this.get(ctx_1, cmds = command.cmds);
                if (_command !== null) return _command;
                else return command;
            }
        }
        return null
    }
}