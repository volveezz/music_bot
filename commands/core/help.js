const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "help",
	aliases: ["h"],
	showHelp: false,
	utilisation: "{prefix}help",

	execute(client, message, args) {
		const embed = new EmbedBuilder();

		embed.setColor("Red");
		embed.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) });

		const commands = client.commands.filter((x) => x.showHelp !== false);

		embed.addFields([
			{
				name: `Включено - ${commands.size}`,
				value: commands.map((x) => `\`${x.name}${x.aliases[0] ? ` (${x.aliases.map((y) => y).join(", ")})\`` : "`"}`).join(" | "),
			},
		]);

		embed.setTimestamp();
		embed.setFooter({ text: "Вуф", iconURL: message.author.avatarURL({ dynamic: true }) });

		message.channel.send({ embeds: [embed] });
	},
};
