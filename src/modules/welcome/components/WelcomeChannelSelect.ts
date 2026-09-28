import type { MessageComponentInteraction } from "discord.js";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { IComponentHandler } from "../../../core/components/interfaces/IComponentHandler";

const CUSTOM_ID = "welcome-set-channel";

export class WelcomeChannelSelect implements IComponentHandler {
  static readonly customId = CUSTOM_ID;

  matches(customId: string): boolean {
    return customId === CUSTOM_ID;
  }

  async handle(interaction: MessageComponentInteraction): Promise<void> {
    if (!interaction.isChannelSelectMenu()) return;
    const channelId = interaction.values[0];

    const modal = new ModalBuilder()
      .setCustomId(`welcome-set:${channelId}`)
      .setTitle("Willkommensnachricht");

    const text = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("Text ({user}, {server}, {count})")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(text));
    await interaction.showModal(modal);
  }
}