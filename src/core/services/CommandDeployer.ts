import { REST, Routes } from "discord.js";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import type { ICommand } from "../commands/ICommand";

const HASH_FILE = ".commands-hash";

export class CommandDeployer {
  constructor(
    private readonly rest: REST,
    private readonly clientId: string,
    private readonly guildId: string,
  ) {}

  async deployIfChanged(commands: ICommand[]): Promise<void> {
    const json = commands.map(c => c.data.toJSON());
    const hash = createHash("sha256").update(JSON.stringify(json)).digest("hex");

    const previousHash = await this.readPreviousHash();
    if (hash === previousHash) {
      console.log("Commands unchanged, skipping deploy.");
      return;
    }

    await this.rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
      body: json,
    });
    await writeFile(HASH_FILE, hash, "utf-8");
    console.log(`Deployed ${json.length} command(s).`);
  }

  private async readPreviousHash(): Promise<string | null> {
    try {
      return await readFile(HASH_FILE, "utf-8");
    } catch {
      return null;
    }
  }
}
