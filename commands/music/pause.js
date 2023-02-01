module.exports = {
	name: "pause",
	aliases: [],
	utilisation: "{prefix}pause",
	voiceChannel: true,

	execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue) return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const success = queue.setPaused(true);

		return message.channel.send(
			success
				? `Текущая музыка ${queue.current.title} приостановлена ✅`
				: `Что-то пошло не так, ${message.author}... повторите попытку ❌`
		);
	},
};
