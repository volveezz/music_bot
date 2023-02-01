module.exports = (client, int) => {
	if (!int.isButton()) return;

	const queue = player.getQueue(int.guildId);

	switch (int.customId) {
		case "saveTrack": {
			if (!queue || !queue.playing)
				return int.reply({ content: `В данный момент музыка не играет... повторите попытку ❌`, ephemeral: true, components: [] });

			int.member
				.send(`Вы сохранили дорожку ${queue.current.title} | ${queue.current.author} с сервера ${int.member.guild.name} ✅`)
				.then(() => {
					return int.reply({
						content: `Я отправил вам название музыки в личных сообщениях ✅`,
						ephemeral: true,
						components: [],
					});
				})
				.catch((error) => {
					return int.reply({
						content: `Невозможно отправить вам личное сообщение... повторите попытку ❌`,
						ephemeral: true,
						components: [],
					});
				});
		}
	}
};
