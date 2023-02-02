const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');
const { EmbedBuilder } = require('discord.js');
const { levelCalculator } = require('./internFunc/updateLevel');

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
    exp: {
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
    },
    hourly: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        unique: false,
    },
    work: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        unique: false,
    }
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Let the bot work for 10 minutes and get you money !'),
    async execute(interaction) {
        const tagName = interaction.user.id;
        Tags.sync();
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { userId: tagName } });

        if (tag) {
            const work = tag.get('work');
            const money = tag.get('money')
            const diamond = tag.get('diamond')
            const level = tag.get('level')
            const exp = tag.get('exp')
            if (Date.now() - work > 600e3) {
                const newMoney = money + Math.floor(Math.random() * (20 * (level + 1) ** (diamond + 1)))
                const newExp = exp + Math.floor(Math.random() * (5 ** (level + 1))) + Math.floor(Math.random() * 100)
                const newLevel = levelCalculator(exp)
                const updateMoney = await Tags.update({ money: newMoney }, { where: { userId: tagName } });
                const updateExp = await Tags.update({ exp: newExp }, { where: { userId: tagName } });
                const updateLevel = await Tags.update({ level: newLevel }, { where: { userId: tagName } });
                const updateWorkTimestamp = await Tags.update({ work: Date.now() }, { where: { userId: tagName } });
                return interaction.reply(`You gained ${newExp-exp} experience and ${newMoney-money} :dollar:`)
            } else {
                return interaction.reply(`Your work isn't ready, come back in ${Math.round(((work+600e3)-Date.now())/60000)} minutes`)
            }
            const invEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Inventaire de ' + username)
                .addFields({ name: 'Money :dollar: :', value: money }, { name: 'Diamond :gem::', value: diamond })
                .setTimestamp()

            return interaction.reply({ embeds: [invEmbed] });
        }

        return interaction.reply(`Could not find tag: ${tagName}`);
    },
};