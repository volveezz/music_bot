const { Player } = require("discord-player");
const { Client, Intents } = require("discord.js");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/callback", (req, res) => {
	res.status(200).end();
});

app.use(express.static(path.join(__dirname, "public")));
app.listen(process.env.PORT || 3000);

global.client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
	disableMentions: "everyone",
});

client.config = require("./config");

global.player = new Player(client, client.config.opt.discordPlayer);

require("./src/loader");
require("./src/events");

client.login(client.config.app.token);
