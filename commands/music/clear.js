module.exports = {
	name: "clear",
	aliases: ["cq"],
	utilisation: "{prefix}clear",
	voiceChannel: true,

	async execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		if (!queue.tracks[0]) return message.channel.send(`Нет музыки в очереди после текущей, ${message.author}... повторите попытку ❌`);

		await queue.clear();

		message.channel.send(`Очередь очищена 🗑️`);
	},
};
