import { Client, GatewayIntentBits, Events, Partials } from "discord.js";
import { HealthMonitor } from "./services//HealthMonitor";
import { GracefulShutdown } from "./services/GracefulShutdown";

export interface IClientWithHealth extends Client {
  health: HealthMonitor;
}

export function createClient(): IClientWithHealth {
  const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel],
  }) as IClientWithHealth;

  const health = new HealthMonitor();
  const shutdown = new GracefulShutdown(client);

  client.health = health;

  client.once(Events.ClientReady, () => {
    health.setHealthy();
  });

  client.on(Events.Error, () => {
    health.setUnhealthy();
  });

  client.on(Events.Warn, () => {});

  setInterval(() => {
    if (client.isReady()) {
      health.setHealthy();
    } else {
      health.setUnhealthy();
    }
  }, 30000);

  shutdown.setup();

  return client;
}
