import { Client } from "@typeit/discord";
import { ClientApplication } from "discord.js";
import { Commands } from "./modules/commands";

export class Bot {
    client: Client;
    application: ClientApplication;

    constructor(public configs: {prefix: string, trigger: string}, public commands: Commands) {
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
