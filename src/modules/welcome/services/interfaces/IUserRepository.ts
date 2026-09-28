import type { UserConfig } from "../../entities/userConfig";

export interface IUserRepository {
  get(userID: string): Promise<UserConfig | null>;
  save(config: UserConfig): Promise<void>;
  delete(guildId: string): Promise<void>;
}