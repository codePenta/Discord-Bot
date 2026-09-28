import type { ModalSubmitInteraction } from "discord.js";
import type { IModalHandler } from "../modals/IModalHandler";

export class ModalRegistry {
  private readonly handlers: IModalHandler[] = [];

  register(handler: IModalHandler): void {
    this.handlers.push(handler);
  }

  async handle(interaction: ModalSubmitInteraction): Promise<void> {
    const handler = this.handlers.find((h) => h.matches(interaction.customId));
    if (!handler) return;
    await handler.handle(interaction);
  }
}