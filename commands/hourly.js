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
        .setName('hourly')
        .setDescription('Can be done every hour to collect a reward'),
    async execute(interaction) {
        const tagName = interaction.user.id;
        Tags.sync();
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { userId: tagName } });
        if (!tag) return interaction.reply(`Do \`!start\` to create an account.`);
        const level = tag.get('level')
        const money = tag.get('money')
        const lastHourly = tag.get('hourly')
        if (Date.now() - lastHourly > 3600e3) {
            const hourlyMoneyReward = Math.round(Math.floor(Math.random() * level) + Math.floor(Math.random() * 53))
            const updateHourlyTime = await Tags.update({ hourly: Date.now() }, { where: { userId: tagName } });
            const updateMoney = await Tags.update({ money: money + hourlyMoneyReward }, { where: { userId: tagName } });
            return interaction.reply(`Hourly successfully claimed, you gained ${hourlyMoneyReward} :dollar:.`)
        } else {
            console.log(lastHourly)
            console.log(Date.now())
            return interaction.reply(`Your hourly isn't ready, come back in ${Math.floor(((lastHourly+3600e3)-Date.now())/60000)} minutes.`)
        }
    },
};