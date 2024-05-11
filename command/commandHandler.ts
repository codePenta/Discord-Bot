import * as path from "path";
import fs from "fs";
import { Client, Collection, Events } from "discord.js";
import MainLogger from "../core/logger";
import Manager from "./commandManager";
import { CustomClient } from "../core/customClient";

export default class CommandHandler
{
    
    private customClient: CustomClient;
    private commandManager: Manager;

    constructor(customClient: CustomClient, commandManager: Manager)
    {
        this.customClient = customClient;
        this.customClient.commands = new Collection();

        this.commandManager = commandManager;
        // this.initHandler();
        this.loadCommands();
        this.customClient.commands.forEach(element => {
            console.log(element);
            
        });
    }

    private loadCommands()
    {
        const foldersPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(foldersPath);

        for (const file of commandFiles)
        {
            const filePath = path.join(foldersPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command)
            {   
                let newCommand = command.data.toJSON();
                this.customClient.commands.set(command.data.name, command);
                MainLogger.info(`Added command /${newCommand['name']}`)
            }
            else
            {
                MainLogger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    private initHandler()
    {
        this.customClient.once(Events.ClientReady, readyClient => 
        {
            MainLogger.info(`Ready! Logged in as ${readyClient.user.tag}`);
        });
    }

    handleCommands()
    {
        this.customClient.on(Events.InteractionCreate, async interaction =>
        {
            if (!interaction.isChatInputCommand()) return;

            const command = this.customClient.commands.get(interaction.commandName);            

            if (!command)
            {
                MainLogger.error(`No command matching '/${interaction.commandName}' was found`);
                return;
            }

            try
            {
                await command.execute(interaction);
            } catch (error)
            {
                if (interaction.replied || interaction.deferred)
                {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                else
                {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });
    }
}