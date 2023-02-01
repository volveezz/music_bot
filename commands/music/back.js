module.exports = {
	name: "back",
	aliases: ["previous"],
	utilisation: "{prefix}back",
	voiceChannel: true,

	async execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		if (!queue.previousTracks[1]) return message.channel.send(`До этого музыка не играла, ${message.author}... повторите попытку ❌`);

		await queue.back();

		message.channel.send(`Воспроизведение **предыдущей** дорожки ✅`);
	},
};
