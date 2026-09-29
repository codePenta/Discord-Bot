import type { MessageComponentInteraction } from "discord.js";
import type { IComponentHandler } from "../components/interfaces/IComponentHandler";

export class ComponentRegistry {
  private readonly handlers: IComponentHandler[] = [];

  register(handler: IComponentHandler): void {
    this.handlers.push(handler);
  }

  async handle(interaction: MessageComponentInteraction): Promise<void> {
    const handler = this.handlers.find((handler) => handler.matches(interaction.customId));
    if (!handler) return;
    await handler.handle(interaction);
  }
}