import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { ICommand } from "./ICommand";

export class PingCommand implements ICommand {
  readonly data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
  }
}