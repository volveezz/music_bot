module.exports = {
	app: {
		px: "$",
		token: "NzE5MjYyNTIxNzY4MjgwMDc0.Xt03bA.f2Qo4mXKf7Wkg-8twBtTm0J0mL8",
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
