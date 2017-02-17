const _ = require('lodash');
const escapeStringRegexp = require('escape-string-regexp');
const latexchars = require('./latexchars.json');

const debug = require('debug')('latexchars');

class LatexChars {
	constructor(options) {
		this.prefix = options.prefix;

		this.substitutions = _.entries(latexchars).map(([name, char]) => {
			return [new RegExp(escapeStringRegexp(this.prefix+name)+'(?=\\s|$|\\\\)', 'g'),
				char];
		});
		
		this.handlers = this.generateHandlers()
	}

	generateHandlers() {

		return [[
			(m) => m.content.match(/\\\w+/ig),
			(m, bot) => {
				let m_new = m.content;
				for (const [regex, char] of this.substitutions) {
					m_new = m_new.replace(regex, char);
				}
				if (m_new !== m.content)
					m.edit(m_new);
			}
		]];
	}
}

module.exports = LatexChars;
