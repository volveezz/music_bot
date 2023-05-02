player.on("error", (queue, error) => {
	console.log(`Произошла ошибка ${error.message}`);
});

player.on("connectionError", (queue, error) => {
	console.log(`Произошла ошибка при подключении ${error.message}`);
});

player.on("trackStart", (queue, track) => {
	if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
	queue.metadata.send(`Начато проигрывание ${track.title} в **${queue.connection.channel.name}** 🎧`);
});

player.on("trackAdd", (queue, track) => {
	queue.metadata.send(`Добавлен трек: ${track.title} в очередь ✅`);
});

player.on("botDisconnect", (queue) => {
	queue.metadata.send("Я был отключен от голосового канала, очистка очереди... ❌");
});

player.on("channelEmpty", (queue) => {
	queue.metadata.send("Никого нет в голосовом канале, выхожу из него... ❌");
});

player.on("queueEnd", (queue) => {
	queue.metadata.send("Воспроизведение всей очереди завершено ✅");
});

client.rest.on("rateLimited", (rateLimit) => {
	console.error(
		`Ratelimited for ${rateLimit.timeToReset} ms, route: ${rateLimit.route}${
			rateLimit.majorParameter ? `, parameter: ${rateLimit.majorParameter}` : ""
		}`
	);
});

process.on("uncaughtException", (error, origin) => {
	console.error("uncaughtException at top level", origin === "uncaughtException" ? error : origin);
});
process.on("unhandledRejection", (error, a) => {
	console.error("unhandledRejection at top level", { error });
});
