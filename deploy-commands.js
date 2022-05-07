const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

const commands = [
	new SlashCommandBuilder().setName('map').setDescription('지금 일겜 맵 머임?'),
	new SlashCommandBuilder().setName('maplist').setDescription('제발 올림푸스'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands in test'))
	.catch(console.error);

// rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
// 	.then(() => console.log('Successfully registered application commands in oreore'))
// 	.catch(console.error);