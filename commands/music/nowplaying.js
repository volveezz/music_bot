const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

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

		const embed = new MessageEmbed();

		embed.setColor("RED");
		embed.setThumbnail(track.thumbnail);
		embed.setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) });

		const methods = ["disabled", "track", "queue"];

		const timestamp = queue.getPlayerTimestamp();
		const trackDuration = timestamp.progress == "Infinity" ? "infinity (live)" : track.duration;

		embed.setDescription(
			`Громкость **${queue.volume}**%\nДлительность **${trackDuration}**\nРежим повтора **${methods[queue.repeatMode]}**\nЗапрошено ${
				track.requestedBy
			}`
		);

		embed.setTimestamp();
		embed.setFooter({ text: "Вуф", iconURL: message.author.avatarURL({ dynamic: true }) });

		const saveButton = new MessageButton();

		saveButton.setLabel("Сохраните этот трек");
		saveButton.setCustomId("saveTrack");
		saveButton.setStyle("SUCCESS");

		const row = new MessageActionRow().addComponents(saveButton);

		message.channel.send({ embeds: [embed], components: [row] });
	},
};
