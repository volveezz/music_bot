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
	queue.metadata.send(`Добавлена дорожка ${track.title} в очередь ✅`);
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
