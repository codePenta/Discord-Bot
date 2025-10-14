import pino, { Logger, LoggerOptions } from "pino"
import { Config } from "../utils/FileUtils"
import YAML from "yaml"

export default class MainLogger
{
    private config: any;
    private yamlFilePath = "pinoSettings.yml";
    private static pinoLogger: Logger;
    private options: LoggerOptions;

    constructor()
    {
        let configContents = Config.readFromYamlFile(this.yamlFilePath);
        this.config = YAML.parse(configContents);
        this.options = {
            name: this.config['logger']['pino']['name'],
            level: this.config['logger']['pino']['level'],
            enabled: this.config['logger']['pino']['enabled'],
            transport:
            {
                target: this.config['logger']['pino']['transports']['targets'][0]
            }
        }

        MainLogger.pinoLogger = pino(this.options);

    }

    static info(message: string)
    {
        MainLogger.pinoLogger.info(message);
    }

    static warn(message: string)
    {
        this.pinoLogger.warn(message);
    }

    static error(message: string)
    {
        this.pinoLogger.error(message);
    }
}