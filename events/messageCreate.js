module.exports = (client, message) => {
	if (message.author.bot || message.channel.type === "dm") return;

	const prefix = client.config.app.px;

	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

	const DJ = client.config.opt.DJ;

	if (cmd && DJ.enabled && DJ.commands.includes(cmd.name)) {
		const roleDJ = message.guild.roles.cache.find((x) => x.name === DJ.roleName);

		if (!message.member._roles.includes(roleDJ.id)) {
			return message.channel.send(
				`Эта команда зарезервирована для участников с ролью ${DJ.roleName} на сервере ${message.author}... повторите попытку ❌`
			);
		}
	}

	if (cmd && cmd.voiceChannel) {
		if (!message.member.voice.channel)
			return message.channel.send(`Вы не находитесь в голосовом канале ${message.author}... попробуйте еще раз`);

		for (const [guildId, guild] of client.guilds.cache) {
			const voiceState = guild.voiceStates.cache.get(client.user.id);
			if (voiceState && voiceState.channel) {
				if (message.member.voice.channel.id !== voiceState.channel.id)
					return message.channel.send(`Вы не находитесь в том же голосовом канале, ${message.author}... повторите попытку ❌`);
			}
		}
	}

	if (cmd) cmd.execute(client, message, args);
};
