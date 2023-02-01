module.exports = {
	name: "progress",
	aliases: ["pbar"],
	utilisation: "{prefix}progress",
	voiceChannel: true,

	async execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const progress = queue.createProgressBar();
		const timestamp = queue.getPlayerTimestamp();

		if (timestamp.progress == "Infinity") return message.channel.send(`Воспроизводится прямая трансляция 🎧`);

		message.channel.send(`${progress} (**${timestamp.progress}**%)`);
	},
};
