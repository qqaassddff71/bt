const { SlashCommandBuilder, InteractionResponse } = require('discord.js');
const Sequelize = require('sequelize');
const { EmbedBuilder } = require('discord.js');
const { diamondPrice } = require('./internFunc/diamondPrice')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

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
        .setName('shop')
        .setDescription('Display your shop'),
    async execute(interaction) {
        const tagName = interaction.user.id;
        Tags.sync();
        const tag = await Tags.findOne({ where: { userId: tagName } });
        if (tag) {
            let cost;
            const level = tag.get('level').toString();
            const username = tag.get('username');
            const money = tag.get('money').toString();
            const diamond = tag.get('diamond').toString();
            const moneyInt = tag.get('money');
            const diamondInt = tag.get('diamond');
            if (tag.get('admin')) {
                cost = 1
            } else {
                cost = diamondPrice(diamond);
            }
            const btnAchat = new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Buy a diamond')
                .setStyle(ButtonStyle.Primary)
            if (money < cost) {
                btnAchat.setDisabled(true)
            }
            if (level > 5) {

            } else {
                const shopEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('shop of ' + username)
                    .addFields({ name: 'level :', value: level, inline: true }, { name: 'Money :dollar: :', value: money, inline: true }, { name: 'Diamond :gem::', value: diamond, inline: true })
                    .addFields({ name: '1 Diamond :', value: "cost: " + cost + " :dollar:", inline: true })
                    .setTimestamp()


                const row = new ActionRowBuilder()
                    .addComponents(
                        btnAchat
                    );
                let msg = await interaction.reply({ embeds: [shopEmbed], components: [row] });
                const filter = i => i.customId === 'primary' && i.user.id === interaction.user.id;

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async i => {
                    const newCost = diamondPrice(diamondInt + 1)
                    const newShopEmbeds = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle('shop of ' + username)
                        .addFields({ name: 'level :', value: level, inline: true }, { name: 'Money :dollar: :', value: (moneyInt - cost).toString(), inline: true }, { name: 'Diamond :gem::', value: (diamondInt + 1).toString(), inline: true })
                        .addFields({ name: '1 Diamond :', value: "cost: " + newCost + " :dollar:", inline: true })
                        .setTimestamp()

                    await i.update({ embeds: [newShopEmbeds], components: [] });
                    const newDiamond = tag.increment('diamond')
                    const updateMoney = await Tags.update({ money: money - cost }, { where: { userId: tagName } });

                    collector.on('end', collected => console.log(`Collected ${collected.size} items`));

                }, )
            }
        } else return interaction.reply(`Could not find tag: ${tagName}`);
    }

};