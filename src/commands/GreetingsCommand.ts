import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { ICommand } from "./ICommand";

export class GreetingsCommand implements ICommand {
  readonly data = new SlashCommandBuilder()
    .setName("greetings")
    .setDescription("Replies with a greeting!");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.user.displayName;
    await interaction.reply(`Greetings, ${username}`);
  }
}