module.exports = {
	name: "filter",
	aliases: [],
	utilisation: "{prefix}filter [filter name]",
	voiceChannel: true,

	async execute(client, message, args) {
		const queue = player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`В данный момент музыка не играет, ${message.author}... повторите попытку ❌`);

		const actualFilter = queue.getFiltersEnabled()[0];

		if (!args[0])
			return message.channel.send(
				`Укажите действительный фильтр для включения или отключения, ${message.author}... повторите попытку ❌\n${
					actualFilter
						? `Фильтр в данный момент активен ${actualFilter} (${client.config.app.px}фильтр ${actualFilter} чтобы его отключить).\n`
						: ""
				}`
			);

		const filters = [];

		queue.getFiltersEnabled().map((x) => filters.push(x));
		queue.getFiltersDisabled().map((x) => filters.push(x));

		const filter = filters.find((x) => x.toLowerCase() === args[0].toLowerCase());

		if (!filter)
			return message.channel.send(
				`Такого фильтра не существует, ${message.author}... повторите попытку ❌\n${
					actualFilter ? `Фильтр в данный момент активен ${actualFilter}.\n` : ""
				}Список доступных фильтров ${filters.map((x) => `**${x}**`).join(", ")}.`
			);

		const filtersUpdated = {};

		filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;

		await queue.setFilters(filtersUpdated);

		message.channel.send(
			`Фильтр ${filter} теперь **${
				queue.getFiltersEnabled().includes(filter) ? "включен" : "отключен"
			}** ✅\n*Напоминание: чем длиннее музыка, тем дольше это займет время.*`
		);
	},
};
