const _ = require('lodash');
const parse_duration = require('parse-duration');
const schedule = require('node-schedule');
const {restrictSelf} = require('../util');

const debug = require('debug')('plugin-yank');

class Yank {
	constructor(client, options) {
		this.client = client;

		this.default_dt = options.default_dt;

		this.handlers = this.generateHandlers()

		this.rex = /\[yank( [\w\d]+)?\]/i;
	}

	generateHandlers() {
		return [[
			(m) => m.content.match(this.rex) && restrictSelf(m, this.client),
			(m, bot) => {
				const dt_s = (m.content.match(this.rex)[1] || this.default_dt).trim();
				const dt = parse_duration(dt_s); const trig = new Date(Date.now() + dt);

				console.log(`Scheduling delete of message (id=${m.id}) in ${dt_s} (@ ${trig})`);

				const j = schedule.scheduleJob(trig, () => {
					m.delete();
				});
			}
		]];
	}
}

module.exports = Yank;
