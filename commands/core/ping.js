const ms = require("ms");

module.exports = {
	name: "ping",
	aliases: [],
	utilisation: "{prefix}ping",

	execute(client, message) {
		message.channel.send(
			`Последний пинг был ${ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })} назад, текущий **${
				client.ws.ping
			}мс** 🛰️`
		);
	},
};
