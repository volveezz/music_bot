module.exports = {
	name: "resume",
	aliases: ["rs"],
	utilisation: "{prefix}resume",
	voiceChannel: true,

	execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue) return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const success = queue.setPaused(false);

		return message.channel.send(
			success
				? `Текущая музыка ${queue.current.title} возобновлена  ✅`
				: `Что-то пошло не так, ${message.author}... попробуйте снова ? ❌`
		);
	},
};
