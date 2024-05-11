import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
                .setName("system")
                .setDescription("Provides information about the bots system"),
    async execute(interaction: any, client: any)
    {
        interaction.reply("Hello");
    }
}