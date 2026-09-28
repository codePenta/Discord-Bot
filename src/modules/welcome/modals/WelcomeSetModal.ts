import type { ModalSubmitInteraction } from "discord.js";
import type { IModalHandler } from "../../../core/modals/IModalHandler";
import type { IWelcomeRepository } from "../services/interfaces/IWelcomeRepository";

const PREFIX = "welcome-set:";

export class WelcomeSetModal implements IModalHandler {
  constructor(private readonly repo: IWelcomeRepository) {}

  matches(customId: string): boolean {
    return customId.startsWith(PREFIX);
  }

  async handle(interaction: ModalSubmitInteraction): Promise<void> {
    if (!interaction.guild) return;
    const channelId = interaction.customId.slice(PREFIX.length);
    const message = interaction.fields.getTextInputValue("text");

    await this.repo.save({ guildId: interaction.guild.id, channelId, message });
    await interaction.reply({ content: `Gespeichert. Ziel: <#${channelId}>`, flags: 64 });
  }
}