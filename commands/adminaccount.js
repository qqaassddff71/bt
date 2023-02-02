const { SlashCommandBuilder, InteractionResponse } = require('discord.js');
const Sequelize = require('sequelize');

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
    exp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
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
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }

});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adminaccount')
        .setDescription('admin Only'),
    async execute(interaction) {
        const tagName = interaction.user.id;
        Tags.sync();
        const tag = await Tags.findOne({ where: { userId: tagName } });
        if (tag) {
            const infiniteMoney = await Tags.update({ money: 99999 }, { where: { userId: tagName } });
            const infiniteDiamond = await Tags.update({ diamond: 99999 }, { where: { userId: tagName } });
            const infiniteExp = await Tags.update({ exp: 1000000 }, { where: { userId: tagName } });
            const adminState = await Tags.update({ admin: true }, { where: { userId: tagName } })
        }
        return interaction.reply('ok')
    }

};