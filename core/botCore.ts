import { Client, Collection, DiscordjsError } from "discord.js";
import { CommandFileReader, Config } from "../utils/FileUtils";
import MainLogger from "./logger";
import CommandManager from '../command/commandManager'
import CommandHandler from "../command/commandHandler";
import { CustomClient } from "./customClient";

export default class Core
{
    customClient: CustomClient;
    token: string = "";
    logger: MainLogger;
    commandManager: CommandManager;
    commandHandler: CommandHandler;

    constructor(customClient: CustomClient, token: string)
    {
        this.token = token;
        this.customClient = customClient;
        this.logger = new MainLogger();
        CommandFileReader.loadCommandsFromFileSystem(this.customClient);
        this.commandManager = new CommandManager();
        this.commandHandler = new CommandHandler(this.customClient, this.commandManager);
    }

    async start()
    {
        if (!Config.validateBotToken(this.token)) return;

        MainLogger.info(`Starting bot`);
        this.customClient.login(this.token);
        await this.commandManager.register();
        this.commandHandler.handleCommands();
    }
}