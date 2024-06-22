import { Client, ClientOptions, GatewayIntentBits } from 'discord.js';
import Core from './core/botCore';
import { Config } from './utils/FileUtils';
import { CustomClient } from './core/customClient';


let clientOptions: ClientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	]
}
const customClient = new Client(clientOptions) as CustomClient;
new Core(customClient, Config.getDiscordToken()).start();