const _ = require('lodash');
const spliceString = require('splice-string');
const escapeStringRegexp = require('escape-string-regexp');
const latexchars = require('./latexchars.json');
const {restrictSelf} = require('../util');

const debug = require('debug')('plugin-latexchars');

class LatexChars {
	constructor(client, options) {
		this.client = client;

		this.prefix = options.prefix;

		this.handlers = this.generateHandlers()
	}

	generateHandlers() {
		return [[
			(m) => m.content.match(/\\[\w\^]+/ig) && restrictSelf(m, this.client),
			(m, bot) => {
				const re = /\\([\w\^]+)(?=\s|$|[\\\(\)\[\],\."])/g;
				let match, matches = [];
				while((match = re.exec(m.content)) !== null) {
					matches.push(match);
				}

				let new_m = m.content;
				for (const match of _.sortBy(matches, 'index').reverse()) {
					new_m = spliceString(new_m, match.index, match[0].length,
						_.get(latexchars, match[1], match[0]));
				}

				m.edit(new_m);
			}
		]];
	}
}

module.exports = LatexChars;
