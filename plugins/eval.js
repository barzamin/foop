const _ = require('lodash');
const {inspect} = require('util');
const debug = require('debug')('plugin-eval');
const {restrictSelf} = require('../util');

class Eval {
	constructor(client, options) {
		this.client = client;

		this.handlers = this.generateHandlers();
		this.rex = /^eval\n```(?:js)?\n([\s\S]*)\n```/;
	}

	generateHandlers() {
		return [[
			(m) => m.content.match(this.rex) && restrictSelf(m, this.client),
			(m, bot) => {
				const code = m.content.match(this.rex)[1];

				console.log(`Running evaluation at request of ${m.author}`);
				try {
					const res = eval(code);
					m.edit(m.content + `\n\`\`\`js\n${inspect(res).substring(0, 1900-m.content.length)}\`\`\``);
				} catch (e) {
					m.edit(m.content + `\n\`\`\`js\n${e}\`\`\``);
				}
			},
		]];
	}
}

module.exports = Eval;
