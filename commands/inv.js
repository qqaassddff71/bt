const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');
const { EmbedBuilder } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'user.sqlite',
});
const Tags = sequelize.define('tags', {
    userId: {
        type: Sequelize.INTEGER,
        unique: true,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    story: Sequelize.TEXT,
    level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    money: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        unique: false,
    },
    diamond: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        unique: false,
    },
    daily: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        unique: false,
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventaire')
        .setDescription('Display your inventory'),
    async execute(interaction) {
        const tagName = interaction.user.id;
        Tags.sync();
        const tag = await Tags.findOne({ where: { userId: tagName } });
        const level = tag.get('level').toString();
        const username = tag.get('username');
        const money = tag.get('money').toString();
        const diamond = tag.get('diamond').toString();
        console.log(tag.money)
        if (tag) {
            const invEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Inventaire de ' + username)
                .addFields({ name: 'level :', value: level }, { name: 'Money :dollar: :', value: money }, { name: 'Diamond :gem::', value: diamond })
                .setTimestamp()

            return interaction.reply({ embeds: [invEmbed] });
        }

        return interaction.reply(`Could not find tag: ${tagName}`);
    },
};