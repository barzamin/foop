const Discord = require('discord.js');
const _ = require('lodash');

const config = _.merge(require('./config.json'), require('./secrets.json'));

const client = new Discord.Client();

let handlers = [];

client.on('ready', () => {
	console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
	console.log(`Connected to ${client.guilds.size} servers.
	N_channels = ${client.channels.size}, N_users = ${client.users.size}`);

	_.forOwn(config.plugins, (opts, plug) => {
		console.log(`Loading plugin ${plug}`);
		const plugin_ = require(`./plugins/${plug}`);
		const plugin = new plugin_(client, opts);

		handlers = handlers.concat(plugin.handlers);
	});
});

client.on('message', m => {
	for (const [trigger, action] of handlers) {
		if (trigger(m)) {
			action(m, client);
		}
	}
});

client.on('error', console.error);
client.on('warn', console.warn);
client.on('disconnect', () => process.exit());

client.login(config.token);

