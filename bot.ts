import { Events, REST } from "discord.js";
import { env } from "./src/config/env";
import { pool } from "./src/config/db";
import { createClient } from "./src/client";
import { CommandRegistry } from "./src/core/services/CommandRegistry";
import { CommandDeployer } from "./src/core/services/CommandDeployer";
import { PingCommand } from "./src/commands/PingCommand";
import { createWelcomeModule } from "./src/modules/welcome";

const client = createClient();
const welcome = createWelcomeModule(pool);

const registry = new CommandRegistry([new PingCommand(), ...welcome.commands]);

const rest = new REST().setToken(env.discordToken);
await new CommandDeployer(rest, env.clientId, env.guildId).deployIfChanged(registry.getAll());

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  await registry.handle(interaction);
});

client.on(Events.GuildMemberAdd, (m) => {
  welcome.onGuildMemberAdd(m).catch(console.error)
});

client.login(env.discordToken);
