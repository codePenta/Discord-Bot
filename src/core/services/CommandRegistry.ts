import type { ChatInputCommandInteraction } from "discord.js";
import type { ICommand, ICommandModal } from "../commands/ICommand";

export class CommandRegistry {
  private readonly commands = new Map<string, ICommand>();


  constructor(commands: ICommand[] = []) {
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
