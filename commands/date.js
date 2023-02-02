const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('date')
        .setDescription('Give you the date'),
    async execute(interaction) {
        await interaction.reply("Today's date" + new Date);
    },
};