const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "queue",
	aliases: ["q"],
	utilisation: "{prefix}queue",
	voiceChannel: true,

	execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue) return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		if (!queue.tracks[0]) return message.channel.send(`Нет музыки в очереди после текущей, ${message.author}... повторите попытку ❌`);

		const embed = new EmbedBuilder();
		const methods = ["", "🔁", "🔂"];

		embed.setColor("Red");
		embed.setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }));
		embed.setAuthor({
			name: `Очередь на сервере - ${message.guild.name} ${methods[queue.repeatMode]}`,
			iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
		});

		const tracks = queue.tracks.map(
			(track, i) => `**${i + 1}** - ${track.title} | ${track.author} (запросил: ${track.requestedBy.username})`
		);

		const songs = queue.tracks.length;
		const nextSongs = songs > 5 ? `И еще **${songs - 5}** песен...` : `В плейлисте **${songs}** песен...`;

		embed.setDescription(`Текущий: ${queue.current.title}\n\n${tracks.slice(0, 5).join("\n")}\n\n${nextSongs}`);

		embed.setTimestamp();
		embed.setFooter({ text: "Вуф", iconURL: message.author.avatarURL({ dynamic: true }) });

		message.channel.send({ embeds: [embed] });
	},
};
