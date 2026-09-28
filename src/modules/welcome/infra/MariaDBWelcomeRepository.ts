import type { Pool } from "mariadb";
import type { WelcomeConfig } from "../entities/WelcomeConfig";
import type { IWelcomeRepository } from "../services/interfaces/IWelcomeRepository";

export class MariaDBWelcomeRepository implements IWelcomeRepository {
  constructor(private readonly pool: Pool) {}

  async get(guildId: string): Promise<WelcomeConfig | null> {
    const rows = await this.pool.query(
      "SELECT guild_id, channel_id, message FROM welcome_config WHERE guild_id = ?",
      [guildId],
    );
    const row = rows[0];
    return row ? { guildId: row.guild_id, channelId: row.channel_id, message: row.message } : null;
  }

  async save(c: WelcomeConfig): Promise<void> {
    await this.pool.query(
      `INSERT INTO welcome_config (guild_id, channel_id, message) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE channel_id = VALUES(channel_id), message = VALUES(message)`,
      [c.guildId, c.channelId, c.message],
    );
  }

  async delete(guildId: string): Promise<void> {
    await this.pool.query("DELETE FROM welcome_config WHERE guild_id = ?", [guildId]);
  }
}