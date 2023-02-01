const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
	name: "search",
	aliases: ["sh"],
	utilisation: "{prefix}search [song name]",
	voiceChannel: true,

	async execute(client, message, args) {
		if (!args[0]) return message.channel.send(`Пожалуйста, введите действительный запрос, ${message.author}... попробовать еще раз ? ❌`);

		const res = await player.search(args.join(" "), {
			requestedBy: message.member,
			searchEngine: QueryType.AUTO,
		});

		if (!res || !res.tracks.length) return message.channel.send(`Ничего не найдено, ${message.author}... попробовать еще раз ? ❌`);

		const queue = await player.createQueue(message.guild, {
			metadata: message.channel,
		});

		const embed = new MessageEmbed();

		embed.setColor("RED");
		embed.setAuthor({ name: `Результаты ${args.join(" ")}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) });

		const maxTracks = res.tracks.slice(0, 10);

		embed.setDescription(
			`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join("\n")}\n\nВыберите вариант между **1** и **${
				maxTracks.length
			}** или **отмена** ⬇️`
		);

		embed.setTimestamp();
		embed.setFooter({ text: "Вуф", iconURL: message.author.avatarURL({ dynamic: true }) });

		message.channel.send({ embeds: [embed] });

		const collector = message.channel.createMessageCollector({
			time: 15000,
			errors: ["time"],
			filter: (m) => m.author.id === message.author.id,
		});

		collector.on("collect", async (query) => {
			if (query.content.toLowerCase() === "cancel") return message.channel.send(`Поиск отменен ✅`) && collector.stop();

			const value = parseInt(query.content);

			if (!value || value <= 0 || value > maxTracks.length)
				return message.channel.send(
					`Недопустимый ответ, попробуйте значение между **1** и **${maxTracks.length}** или **отмена**... попробовать еще раз ? ❌`
				);

			collector.stop();

			try {
				if (!queue.connection) await queue.connect(message.member.voice.channel);
			} catch {
				await player.deleteQueue(message.guild.id);
				return message.channel.send(`Я не могу присоединиться к голосовому каналу, ${message.author}... попробовать еще раз ? ❌`);
			}

			await message.channel.send(`Загрузка вашего запроса... 🎧`);

			queue.addTrack(res.tracks[query.content - 1]);

			if (!queue.playing) await queue.play();
		});

		collector.on("end", (msg, reason) => {
			if (reason === "time") return message.channel.send(`Поиск превысил лимит ожидания, ${message.author}... попробовать еще раз ? ❌`);
		});
	},
};
