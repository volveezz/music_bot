require("dotenv/config");
module.exports = {
	app: {
		px: "$",
		token: process.env.TOKEN,
		playing: "Введи $play < название >",
	},

	opt: {
		DJ: {
			enabled: false,
			roleName: "DJ",
			commands: ["back", "clear", "filter", "loop", "pause", "resume", "seek", "shuffle", "skip", "stop", "volume"],
		},
		maxVol: 1000,
		loopMessage: false,
		discordPlayer: {
			ytdlOptions: {
				quality: "highestaudio",
				highWaterMark: 1 << 25,
			},
		},
	},
};
