const ms = require("ms");

module.exports = {
	name: "seek",
	aliases: [],
	utilisation: "{prefix}seek [time]",
	voiceChannel: true,

	async execute(client, message, args) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const timeToMS = ms(args.join(" "));

		if (timeToMS >= queue.current.durationMS)
			return message.channel.send(
				`Указанное время выше общего времени текущей песни ${message.author}... повторите попытку ❌\n*Попробуйте, например, допустимое время, такое как **5s, 10s, 20 seconds, 1m**...*`
			);

		await queue.seek(timeToMS);

		message.channel.send(`Время установлено в текущей песне **${ms(timeToMS, { long: true })}** ✅`);
	},
};
