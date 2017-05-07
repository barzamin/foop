function restrictSelf(m, client) {
	return m.author.id === client.user.id;
}

module.exports = {restrictSelf};