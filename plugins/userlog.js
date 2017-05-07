const _ = require('lodash');
const fs = require('fs');

class Logger {
	constructor(client, options) {
		this.client = client;

		this.users = options.users.map(u=>u.toString());

		this.handlers = this.generateHandlers()
	}

	generateHandlers() {
		return [[
			(m) => this.users.includes(m.author.id),
			(m) => {
				const fpath = `logs/users/${m.author.username}_${m.author.discriminator}.log`;
				const locator = m.guild ? `${m.guild.name} (${m.guild.id})#${m.channel.name}` : 'dm';
				const logline = `[${locator}][${m.createdAt}] ${m.author.username}#${m.author.discriminator}: ${m.content}\n`;
				fs.appendFile(fpath, logline, (err)=>{if (err) console.error(err);});
			}
		]]
	}
}

module.exports = Logger;
