import type { MessageComponentInteraction } from "discord.js";

export interface IComponentHandler {
  matches(customId: string): boolean;
  handle(interaction: MessageComponentInteraction): Promise<void>;
}