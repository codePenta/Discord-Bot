import type { GuildMember } from "discord.js";
import type { Pool } from "mariadb";
import { MariaDBWelcomeRepository } from "./infra/MariaDBWelcomeRepository";
import { WelcomeCommand } from "./commands/WelcomeCommand";
import { WelcomeHandler } from "./services/WelcomeHandler";
import { WelcomeSetModal } from "./modals/WelcomeSetModal";
import { WelcomeChannelSelect } from "./components/WelcomeChannelSelect";
import { MariaDBUserRepository } from "./infra/MariaDBUserRepository";

export function createWelcomeModule(pool: Pool) {
  const welcomeRepo = new MariaDBWelcomeRepository(pool);
  const userRepo = new MariaDBUserRepository(pool);  
  const handler = new WelcomeHandler(welcomeRepo, userRepo);
  return {
    commands: [new WelcomeCommand(welcomeRepo, handler)],
    modals: [new WelcomeSetModal(welcomeRepo)],
    components: [new WelcomeChannelSelect()],
    onGuildMemberAdd: (member: GuildMember) => handler.handle(member),
  };
}