import type { WelcomeConfig } from "../../entities/WelcomeConfig";

export interface IWelcomeRepository {
  get(guildId: string): Promise<WelcomeConfig | null>;
  save(config: WelcomeConfig): Promise<void>;
  delete(guildId: string): Promise<void>;
}