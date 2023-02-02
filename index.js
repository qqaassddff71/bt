const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const Sequelize = require('sequelize');
const client = new Client({ intents: 1 });

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
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

client.once(Events.ClientReady, () => {
    Tags.sync();
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    const channelS = client.channels.cache.get('652876073150840852')

    channelS.messages.fetch('1066702092082884688').then(messages => { //<---error here
        messages.edit("lol")
    });
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'New account') {
        await interaction.reply({ content: 'Your submission was received successfully!' });
    }
    if (!interaction.isModalSubmit()) return;

    try {
        const tag = await Tags.create({
            userId: interaction.user.id,
            username: interaction.fields.getTextInputValue('username'),
            story: interaction.fields.getTextInputValue('story')
        });

        return interaction.reply(`Tag ${tag.username} added.`);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return interaction.reply('You already have an account.');
        }

        return interaction.reply('Something went wrong with creating your account.');
    }
});
client.login(token);