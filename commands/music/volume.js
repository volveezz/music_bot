const maxVol = client.config.opt.maxVol;

module.exports = {
	name: "volume",
	aliases: ["vol"],
	utilisation: `{prefix}volume [1-${maxVol}]`,
	voiceChannel: true,

	execute(client, message, args) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const vol = parseInt(args[0]);

		if (!vol)
			return message.channel.send(
				`Текущая громкость ${queue.volume} 🔊\n*Чтобы изменить громкость, введите допустимое число между **1** и **${maxVol}**.*`
			);

		if (queue.volume === vol)
			return message.channel.send(
				`Громкость, которую вы хотите изменить, уже является текущей, ${message.author}... повторите попытку ❌`
			);

		if (vol < 0 || vol > maxVol)
			return message.channel.send(
				`Указанное число недопустимо. Введите число между **1** и **${maxVol}**, ${message.author}... повторите попытку ❌`
			);

		const success = queue.setVolume(vol);

		return message.channel.send(
			success
				? `Громкость была изменена на **${vol}**/**${maxVol}**% 🔊`
				: `Что-то пошло не так, ${message.author}... повторите попытку ❌`
		);
	},
};
