import { Client } from "@typeit/discord";
import { ClientApplication } from "discord.js";
import { Commands } from "./modules/command_classes";

export class Bot {
    client: Client;
    application: ClientApplication;
    commands: Commands | undefined;
    configs: {prefix: string, trigger: string};

    constructor(configurations: {prefix: string, trigger: string}, commands: Commands) {
        this.configs = configurations;
        this.commands = commands;
        this.client = new Client({
            classes: [
                `${__dirname}/*Discord.ts`,
            ],
            silent: false,
            variablesChar: ":",
        });
        
    }

    update_commands(commands: Commands): void {
        this.commands = commands;
    }

    async start(token: string): Promise<void> {
        await this.client.login(token)
        this.application = await this.client.fetchApplication();
    }
    
}
