import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Watch the magic"),
    async execute(interaction: any, client: any)
    {
        interaction.reply("Hello " + interaction);
    }
}