import { REST, Routes } from "discord.js";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ICommand } from "../commands/ICommand";

const HASH_FILE = process.env.COMMANDS_HASH_FILE ?? "data/.commands-hash";

export class CommandDeployer {
  constructor(
    private readonly rest: REST,
    private readonly clientId: string,
    private readonly guildId: string | undefined,
  ) {}

  async deployIfChanged(commands: ICommand[]): Promise<void> {
    const json = commands.map(c => c.data.toJSON());
    const hash = createHash("sha256").update(JSON.stringify(json)).digest("hex");

    const previousHash = await this.readPreviousHash();
    if (hash === previousHash) {
      console.log("Commands unchanged, skipping deploy.");
      return;
    }

    const route = this.guildId ? 
      Routes.applicationGuildCommands(this.clientId, this.guildId) : Routes.applicationCommands(this.clientId);

    await this.rest.put(route, {
      body: json,
    });

    console.log(`Deployed ${json.length} command(s) ${this.guildId ? `to guild ${this.guildId}` : "globally"}.`);

    await this.storeHash(hash);
  }

  private async readPreviousHash(): Promise<string | null> {
    try {
      return (await readFile(HASH_FILE, "utf-8")).trim();
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn(`Could not read command hash (${HASH_FILE}):`, err);
      }
      return null;
    }
  }

  private async storeHash(hash: string): Promise<void> {
    try {
      await mkdir(dirname(HASH_FILE), { recursive: true });
      await writeFile(HASH_FILE, hash, "utf-8");
    } catch (err) {
      console.warn(`Could not store command hash (${HASH_FILE}), will redeploy on next start:`, err);
    }
  }
}