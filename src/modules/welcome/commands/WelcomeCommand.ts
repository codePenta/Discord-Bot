import {
  ChannelType,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  SelectMenuAssertions,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { ICommand } from "../../../core/commands/ICommand";
import type { IWelcomeRepository } from "../services/interfaces/IWelcomeRepository";
import type { WelcomeHandler } from "../services/WelcomeHandler";

export class WelcomeCommand implements ICommand {
  readonly data = new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Willkommensnachricht konfigurieren")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((s) =>
      s
        .setName("set")
        .setDescription("Set channel and message ({user}, {server}, {count})")
        .addChannelOption((o) =>
          o.setName("channel").setDescription("Target channel").addChannelTypes(ChannelType.GuildText).setRequired(true),
        )
        .addStringOption((o) => o.setName("text").setDescription("Message contents").setRequired(true)),
    )
    .addSubcommand((s) => s.setName("off").setDescription("Deactive welcome message"))
    .addSubcommand((s) => s.setName("test").setDescription("Send message with yourself as test user"));

  constructor(
    private readonly repo: IWelcomeRepository,
    private readonly handler: WelcomeHandler,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guild = interaction.guild;
    if (!guild) return;
    const reply = (content: string) => interaction.reply({ content, flags: MessageFlags.Ephemeral });
    switch (interaction.options.getSubcommand()) {
      case "set": {
        const channel = interaction.options.getChannel("channel", true);
        const message = interaction.options.getString("text", true);
        await this.repo.save({ guildId: guild.id, channelId: channel.id, message });
        await reply(`Saved. Target: <#${channel.id}>`);
        break;
      }
      case "off":
        await this.repo.delete(guild.id);
        await reply("Deactived welcome message.");
        break;
      case "test": {
        const member = await guild.members.fetch(interaction.user.id);
        await this.handler.handle(member);
        await reply("Test message sent, if configured.");
        break;
      }
    }
  }
}