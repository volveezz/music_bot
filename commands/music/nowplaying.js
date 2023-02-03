const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
	name: "nowplaying",
	aliases: ["np"],
	utilisation: "{prefix}nowplaying",
	voiceChannel: true,

	execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const track = queue.current;

		const embed = new EmbedBuilder();

		embed.setColor("Red");
		embed.setThumbnail(track.thumbnail);
		embed.setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) });

		const methods = ["отключен", "этот трек", "очередь"];

		const timestamp = queue.getPlayerTimestamp();
		const trackDuration = timestamp.progress == "Infinity" ? "infinity (live)" : track.duration;

		embed.setDescription(
			`Громкость **${queue.volume}**%\nДлительность **${trackDuration}**\nРежим повтора **${methods[queue.repeatMode]}**\nЗапросил: ${
				track.requestedBy
			}`
		);

		embed.setTimestamp();
		embed.setFooter({ text: "Вуф", iconURL: message.author.avatarURL({ dynamic: true }) });

		const saveButton = new ButtonBuilder();

		saveButton.setLabel("Сохраните этот трек");
		saveButton.setCustomId("saveTrack");
		saveButton.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder().addComponents(saveButton);

		message.channel.send({ embeds: [embed], components: [row] });
	},
};
