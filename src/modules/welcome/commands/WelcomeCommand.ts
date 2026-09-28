import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { ICommand } from "../../../core/commands/ICommand";
import type { IWelcomeRepository } from "../services/interfaces/IWelcomeRepository";
import type { WelcomeHandler } from "../services/WelcomeHandler";
import { WelcomeChannelSelect } from "../components/WelcomeChannelSelect";

export class WelcomeCommand implements ICommand {
  readonly data = new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Willkommensnachricht konfigurieren")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((s) => s.setName("set").setDescription("Channel wählen und Text per Formular eingeben"))
    .addSubcommand((s) => s.setName("off").setDescription("Willkommensnachricht deaktivieren"))
    .addSubcommand((s) => s.setName("test").setDescription("Nachricht mit dir als Testperson senden"));

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
        const select = new ChannelSelectMenuBuilder()
          .setCustomId(WelcomeChannelSelect.customId)
          .setChannelTypes(ChannelType.GuildText)
          .setPlaceholder("Ziel-Channel wählen");

        await interaction.reply({
          content: "Wähle den Channel für die Willkommensnachricht:",
          components: [new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(select)],
          flags: MessageFlags.Ephemeral,
        });
        break;
      }
      case "off":
        await this.repo.delete(guild.id);
        await reply("Willkommensnachricht deaktiviert.");
        break;
      case "test": {
        const member = await guild.members.fetch(interaction.user.id);
        await this.handler.handle(member);
        await reply("Testnachricht gesendet (falls konfiguriert).");
        break;
      }
    }
  }
}