import * as path from "path";
import * as fs from 'fs'
import YAML from "yaml"
import { CustomClient } from "../core/customClient";
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const configPath: string = "pinoSettings.yml";

class Config
{
    static validateBotToken(token: string): boolean
    {
        return !token ? false : true;
    }

    static readFromYamlFile(path: string): string
    {
        const output: string = fs.readFileSync(path, 'utf-8');
        const translatedOutput = Config.replaceTokensWithValues(output, [process.env.SECRET_TOKEN!], ["<SECRET_TOKEN>"]);

        return translatedOutput;
    }

    private static replaceTokensWithValues(rawText: string, values: string[], tokens: string[])
    {
        let textWithReplacecContents = "";

        tokens.forEach((token: string) => 
        {
            let currentValue = values.at(values.indexOf(token));
            if (!currentValue)
                return;

            textWithReplacecContents = rawText.replace(token, currentValue);
        })

        return textWithReplacecContents;
    }

    static getDiscordToken(): string
    {
        let hi = String(YAML.parse(this.readFromYamlFile(configPath))['discord']['token']);
        console.log(hi);


        return String(YAML.parse(this.readFromYamlFile(configPath))['discord']['token']);
    }

    static getClientID(): string
    {
        return String(YAML.parse(this.readFromYamlFile(configPath))['discord']['clientId']);
    }

    static getGuildID(): string
    {
        return String(YAML.parse(this.readFromYamlFile(configPath))['discord']['guildId']);
    }
}

class CommandFileReader
{
    static readonly commandsFolderPath: string = path.join(__dirname, "commands");
    static readonly commandFiles: string[] = fs
        .readdirSync(this.commandsFolderPath)
        .filter((file) => file.endsWith(".ts"));

    static readonly commands: string[] = [];

    static loadCommandsFromFileSystem(customClient: CustomClient)
    {
        for (const file of CommandFileReader.commandFiles)
        {
            const filePath = path.join(CommandFileReader.commandsFolderPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command)
            {
                CommandFileReader.commands.push(command.data.toJSON());
                customClient.commands.set(command.data.name, command);
            }
        }
    }

    public get commands(): string[]
    {
        return this.commands.length == 0 ? ["No commands added yet"] : this.commands;
    }
}

export 
{
    Config,
    CommandFileReader
}
