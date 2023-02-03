module.exports = {
	name: "skip",
	aliases: ["sk", "s", "next"],
	utilisation: "{prefix}skip",
	voiceChannel: true,

	execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const success = queue.skip();

		return message.channel.send(
			success ? `Текущая музыка ${queue.current.title} пропущена ✅` : `Что-то пошло не так, ${message.author}... повторите попытку ? ❌`
		);
	},
};
