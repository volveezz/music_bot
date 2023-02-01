module.exports = {
	name: "save",
	aliases: ["sv"],
	utilisation: "{prefix}save",
	voiceChannel: true,

	async execute(client, message) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		message.author
			.send(`Вы сохранили трек ${queue.current.title} | ${queue.current.author} с сервера ${message.guild.name} ✅`)
			.then(() => {
				message.channel.send(`Я отправил название музыки вам в личные сообщения ✅`);
			})
			.catch((error) => {
				message.channel.send(`Не удалось отправить вам личное сообщение, ${message.author}... попробуйте снова ? ❌`);
			});
	},
};
