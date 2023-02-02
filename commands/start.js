const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'user.sqlite',
});
const Tags = sequelize.define('tags', {
    userId: {
        type: Sequelize.INTEGER,
        unique: true,
    },
})
module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Create your account'),
    async execute(interaction) {
        // Create the modal
        const tagName = interaction.user.id;
        Tags.sync();
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { userId: tagName } });
        if (tag) return interaction.reply('You already have an account')
        const modal = new ModalBuilder()
            .setCustomId('New Account')
            .setTitle('New Account');

        // Add components to modal

        // Create the text input components
        const username = new TextInputBuilder()
            .setCustomId('username')
            // The label is the prompt the user sees for this input
            .setLabel("What's your username ?")
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const story = new TextInputBuilder()
            .setCustomId('story')
            .setLabel("What's your Story ?")
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(username);
        const secondActionRow = new ActionRowBuilder().addComponents(story);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);

    },

};