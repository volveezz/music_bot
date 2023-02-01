const { QueryType } = require("discord-player");

module.exports = {
	name: "play",
	aliases: ["p"],
	utilisation: "{prefix}play [song name/URL]",
	voiceChannel: true,

	async execute(client, message, args) {
		if (!args[0]) return message.channel.send(`Пожалуйста, введите действительный запрос, ${message.author}... повторите попытку ❌`);

		const res = await player.search(args.join(" "), {
			requestedBy: message.member,
			searchEngine: QueryType.AUTO,
		});

		if (!res || !res.tracks.length) return message.channel.send(`Результаты не найдены, ${message.author}... повторите попытку ❌`);

		const queue = await player.createQueue(message.guild, {
			metadata: message.channel,
		});

		try {
			if (!queue.connection) await queue.connect(message.member.voice.channel);
		} catch {
			await player.deleteQueue(message.guild.id);
			return message.channel.send(`Я не могу присоединиться к голосовому каналу, ${message.author}... повторите попытку ❌`);
		}

		await message.channel.send(`Загрузка вашего ${res.playlist ? "плейлиста" : "трека"}... 🎧`);

		res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (!queue.playing) await queue.play();
	},
};
