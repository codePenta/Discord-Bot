import type { ModalSubmitInteraction } from "discord.js";

export interface IModalHandler {
  matches(customId: string): boolean;
  handle(interaction: ModalSubmitInteraction): Promise<void>;
}