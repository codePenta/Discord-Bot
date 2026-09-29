import { ChannelType, type GuildMember } from "discord.js";
import type { IWelcomeRepository } from "./interfaces/IWelcomeRepository";
import type { IUserRepository } from "./interfaces/IUserRepository";
import { renderWelcome } from "../renderWelcome";

export class WelcomeHandler {
  constructor(private readonly welcomeRepo: IWelcomeRepository, private userRepo: IUserRepository) {}

  async handle(member: GuildMember): Promise<void> {
    const config = await this.welcomeRepo.get(member.guild.id);    
    const users = await this.userRepo.get(member.id);

    if (!config) return;

    const channel = await member.guild.channels.fetch(config.channelId);
    if (channel?.type !== ChannelType.GuildText) return;

    let content: string | null;

    if (users != null)
    {      
      content = renderWelcome(`Welome back {user}!`, {
        user: `<@${member.id}>`,
        server: member.guild.name,
        memberCount: member.guild.memberCount,  
      });
    }
    else
    {
      content = renderWelcome(config.message, {
        user: `<@${member.id}>`,
        server: member.guild.name,
        memberCount: member.guild.memberCount,
      });

      this.userRepo.save({ guildId: member.guild.id, userId: member.id });
    }

    await channel.send({ content, allowedMentions: { users: [member.id] } });
  }
}