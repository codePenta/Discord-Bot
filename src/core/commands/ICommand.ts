import type {
  ChatInputCommandInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type SlashCommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export interface ICommand {
  readonly data: SlashCommandData;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface ICommandModal {
  readonly data: SlashCommandData;
  execute(interaction: ModalSubmitInteraction): Promise<void>;
}