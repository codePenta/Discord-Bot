import * as path from "path";
import * as fs from 'fs'
import YAML from "yaml"

const configPath: string = "pinoSettings.yml";

export default class Config
{

    static validateBotToken(token: string): boolean
    {
        if (!token)
        {
            return false;
        }
        return true;
    }

    static readFromYamlFile(path: string): string
    {
        const output: string = fs.readFileSync(path, 'utf-8');
        return output;
    }

    static getDiscordToken(): string
    {
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

