const { SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');
const { EmbedBuilder } = require('discord.js');
const date = require('./date');

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
        .setName('daily')
        .setDescription('Can be done every hour to collect a reward'),
    async execute(interaction) {
        const tagName = interaction.user.id;
        Tags.sync();
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { userId: tagName } });
        if (!tag) return interaction.reply(`Do \`!start\` to create an account.`);
        const level = tag.get('level')
        const money = tag.get('money')
        const lastdaily = tag.get('daily')
        if (Date.now() - lastdaily > 3600e3 * 24) {
            const dailyMoneyReward = Math.round(Math.floor(Math.random() * (level + 1) * 2) + Math.floor(Math.random() * 106))
            const updatedailyTime = await Tags.update({ daily: Date.now() }, { where: { userId: tagName } });
            const updateMoney = await Tags.update({ money: money + dailyMoneyReward }, { where: { userId: tagName } });
            return interaction.reply(`daily successfully claimed, you gained ${dailyMoneyReward} :dollar:.`)
        } else {
            console.log(lastdaily)
            console.log(Date.now())
            const hoursLeft = Math.floor(((lastdaily + 3600e3 * 24) - Date.now()) / 3600e3)
            return interaction.reply(`Your daily isn't ready, come back in ${hoursLeft} hours and ${Math.round(((((lastdaily + 3600e3 * 24) - Date.now()) / 3600e3)-hoursLeft)*60)} minutes.`)
        }
    },
};