import type { Collection, ChatInputCommandInteraction } from "discord.js";
import type { ICommand } from "../commands/ICommand";
import { PingCommand } from "../commands/PingCommand";
import { GreetingsCommand } from "../commands/GreetingsCommand";

export class CommandRegistry {
  private readonly commands = new Map<string, ICommand>();

    

  constructor(commands: ICommand[] = [new PingCommand(), new GreetingsCommand()]) {
    for (const command of commands) {
      this.commands.set(command.data.name, command);
    }
  }

  getAll(): ICommand[] {
    return [...this.commands.values()];
  }

  getJSON() {
    return this.getAll().map(c => c.data.toJSON());
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction);
  }
}