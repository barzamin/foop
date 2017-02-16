const Discord = require('discord.js');
const _ = require('lodash');

const client = Discord.Client(config.token);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
});
