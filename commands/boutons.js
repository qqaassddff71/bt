const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Testing buttons !'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Click me!')
                .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({ content: 'I think you should,', components: [row] });
        const filter = i => i.customId === 'primary' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            await i.update({ content: `<@${interaction.user.id}> Clicked the button`, components: [] });
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));

    },
};