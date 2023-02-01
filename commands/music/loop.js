const { QueueRepeatMode } = require("discord-player");

module.exports = {
	name: "loop",
	aliases: ["lp", "repeat"],
	utilisation: "{prefix}loop <queue>",
	voiceChannel: true,

	execute(client, message, args) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		if (args.join("").toLowerCase() === "queue") {
			if (queue.repeatMode === 1)
				return message.channel.send(
					`Сначала необходимо отключить текущую музыку в режиме повтора (${client.config.app.px} в повторе). ${message.author}... повторите попытку ❌`
				);

			const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

			return message.channel.send(
				success
					? `Режим повтора **${queue.repeatMode === 0 ? "отключен" : "включен"}** вся очередь будет повторяться бесконечно 🔁`
					: `Что-то пошло не так, ${message.author}... повторите попытку ❌`
			);
		} else {
			if (queue.repeatMode === 2)
				return message.channel.send(
					`Сначала необходимо отключить текущую очередь в режиме повтора (${client.config.app.px} в очереди повтора) ${message.author}... повторите попытку ❌`
				);

			const success = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);

			return message.channel.send(
				success
					? `Режим повтора **${
							queue.repeatMode === 0 ? "отключен" : "включен"
					  }** текущая музыка будет повторяться бесконечно (вы можете повторять очередь с помощью опции <queue>) 🔂`
					: `Что-то пошло не так, ${message.author}... повторите попытку ❌`
			);
		}
	},
};
