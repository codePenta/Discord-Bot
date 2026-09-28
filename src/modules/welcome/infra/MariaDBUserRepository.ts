import type { Pool } from "mariadb";
import type { UserConfig } from "../entities/userConfig";
import type { IUserRepository } from "../services/interfaces/IUserRepository";

export class MariaDBUserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async get(userId: string): Promise<UserConfig | null> {
    const rows = await this.pool.query(
      "SELECT user_id, guild_id FROM users WHERE user_id = ?",
      [userId],
    );
    const row = rows[0];
    return row ? { guildId: row.guild_id, userId: row.user_id } : null;
  }

  async save(c: UserConfig): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (user_id, guild_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), guild_id = VALUES(guild_id)`,
      [c.userId, c.guildId],
    );
  }

  async delete(guildId: string): Promise<void> {
    await this.pool.query("DELETE FROM users WHERE guild_id = ?", [guildId]);
  }
}