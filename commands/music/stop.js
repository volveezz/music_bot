module.exports = {
	name: "stop",
	aliases: ["dc"],
	utilisation: "{prefix}stop",
	voiceChannel: true,

	execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		queue.destroy();

		message.channel.send(`Музыка остановлена на этом сервере, увидимся в следующий раз ✅`);
	},
};
