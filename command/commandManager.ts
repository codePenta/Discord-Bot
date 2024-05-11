import * as path from "path";
import fs from "fs";
import { Client, Collection, Events, REST, Routes } from "discord.js";
import MainLogger from "../core/logger";
import Config from "../utils/FileUtils";
import { CustomClient } from "../core/customClient";

export default class Manager
{
    readonly commands: string[] = [];
    private customClient: CustomClient;
    private commandsFolderPath: string = path.join(__dirname, "commands");
    private commandFiles: string[] = fs
        .readdirSync(this.commandsFolderPath)
        .filter((file) => file.endsWith(".ts"));

    constructor(customClient: CustomClient)
    {
        this.customClient = customClient

        this.load();
    }

    private load()
    {
        MainLogger.info(`Attemping to load commands...`);
        for (const file of this.commandFiles)
        {
            const filePath = path.join(this.commandsFolderPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command)
            {   
                let newCommand = command.data.toJSON();
                this.commands.push(newCommand);
                MainLogger.info(`Added command /${newCommand['name']}`)
            }
            else
            {
                MainLogger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    async register()
    {
        const rest = new REST().setToken(Config.getDiscordToken());
        try
        {
            console.log(`Started refreshing ${this.commands.length} application (/) commands.`);
            const result: any = await rest.put(
                Routes.applicationGuildCommands(Config.getClientID(), Config.getGuildID()),
                { body: this.commands },
            );
        }
        catch (error)
        {
            console.error(error);
        }
    }
}
