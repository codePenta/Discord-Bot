import { Events, REST } from "discord.js";
import { env } from "./src/config/env";
import { pool } from "./src/config/db";
import { createClient } from "./src/client";
import { CommandRegistry } from "./src/core/services/CommandRegistry";
import { CommandDeployer } from "./src/core/services/CommandDeployer";
import { PingCommand } from "./src/commands/PingCommand";
import { createWelcomeModule } from "./src/modules/welcome";
import { ModalRegistry } from "./src/core/services/ModalRegistry";
import { ComponentRegistry } from "./src/core/services/ComponentRegistry";

const client = createClient();
const welcome = createWelcomeModule(pool);

const commandRegistry = new CommandRegistry([new PingCommand(), ...welcome.commands]);

const modalRegistry = new ModalRegistry();
for (const modal of welcome.modals) modalRegistry.register(modal);

const componentRegistry = new ComponentRegistry();
for (const component of welcome.components) componentRegistry.register(component);

const rest = new REST().setToken(env.discordToken);
await new CommandDeployer(rest, env.clientId, env.guildId).deployIfChanged(commandRegistry.getAll());

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await commandRegistry.handle(interaction);
  } else if (interaction.isModalSubmit()) {
    await modalRegistry.handle(interaction);
  } else if (interaction.isMessageComponent()) {
    await componentRegistry.handle(interaction);
  }
});

client.on(Events.GuildMemberAdd, (m) => {
  welcome.onGuildMemberAdd(m).catch(console.error)
});

client.login(env.discordToken);
