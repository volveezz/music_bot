import { ActivityType, Client, Collection, GatewayIntentBits, Partials, } from "discord.js";
import "dotenv/config";
import { join, resolve } from "path";
import getFiles from "../utils/fileReader.js";
const __dirname = resolve();
const guildId = process.env.GUILDID;
export class ExtendedClient extends Client {
    commands = new Collection();
    guild;
    activity = { name: "/музыка играть", type: ActivityType.Custom };
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ],
            partials: [Partials.GuildMember, Partials.Channel, Partials.Message, Partials.User],
        });
        this.start();
    }
    async start() {
        await this.login(process.env.TOKEN);
        this.registerModules();
    }
    updatePresence() {
        const activity = this.activity;
        this.user.setPresence({
            activities: [activity],
        });
    }
    getCachedGuild() {
        return (this.guild || this.guilds.cache.get(guildId));
    }
    getCachedMembers() {
        return (this.guild || this.guilds.cache.get(guildId)).members.cache;
    }
    async getAsyncMember(id) {
        const guildMembers = (this.guild || (await this.guilds.fetch(guildId))).members;
        return guildMembers.cache.get(id) || (await guildMembers.fetch(id));
    }
    getCachedTextChannel(id) {
        return (this.guild || this.guilds.cache.get(guildId)).channels.cache.get(id);
    }
    async getAsyncTextChannel(id) {
        const guild = this.getCachedGuild() || this.guilds.cache.get(guildId) || (await this.guilds.fetch(guildId));
        return (this.getCachedTextChannel(id) || guild.channels.cache.get(id) || guild.channels.fetch(id));
    }
    async getAsyncMessage(inputChannel, messageId) {
        const resolvedChannel = typeof inputChannel === "string" ? await this.getAsyncTextChannel(inputChannel) : inputChannel;
        return resolvedChannel.messages.cache.get(messageId) || resolvedChannel.messages.fetch(messageId);
    }
    async importFile(filePath) {
        return (await import(filePath))?.default;
    }
    async registerCommands({ global, commands }) {
        if (global) {
            this.application.commands.set(commands);
        }
        else {
            (this.guild || this.guilds.cache.get(guildId))?.commands.set(commands);
        }
    }
    async loadCommands() {
        const guildCommands = [];
        const globalCommands = [];
        const commandFiles = await getFiles(join(__dirname, "dist/commands/"));
        const commandReading = commandFiles.map((filePath) => {
            return this.importFile(`../commands/${filePath}`).then((command) => {
                if (!command) {
                    console.error("[Error code: 1132] Command file not valid", { filePath });
                    return;
                }
                if (!command.name) {
                    console.error("[Error code: 1135] Unable to find command name for", { filePath });
                    return;
                }
                if (command.userContextMenu) {
                    this.commands.set(command.userContextMenu.name, command);
                    if (command.global) {
                        globalCommands.push(command.userContextMenu);
                    }
                    else {
                        guildCommands.push(command.userContextMenu);
                    }
                }
                if (command.messageContextMenu) {
                    this.commands.set(command.messageContextMenu.name, command);
                    if (command.global) {
                        globalCommands.push(command.messageContextMenu);
                    }
                    else {
                        guildCommands.push(command.messageContextMenu);
                    }
                }
                this.commands.set(command.name, command);
                if (command.global) {
                    return globalCommands.push(command);
                }
                guildCommands.push(command);
            });
        });
        await Promise.all(commandReading);
        await this.registerCommands({ global: true, commands: globalCommands });
        await this.registerCommands({ global: false, commands: guildCommands });
    }
    async loadEvents() {
        const eventFiles = await getFiles(join(__dirname, "dist/events/"));
        const eventPromises = eventFiles.map((filePath) => {
            return this.importFile(`../events/${filePath}`).then((event) => {
                if (!event) {
                    console.error("[Error code: 1137] Event file not valid", { filePath });
                    return;
                }
                this.on(event.event, event.run);
            });
        });
        await Promise.all(eventPromises);
    }
    async registerModules() {
        this.on("ready", async (client) => {
            this.updatePresence();
            const guilds = await client.guilds.fetch();
            const fetchGuildsPromises = guilds.map(async (guild) => {
                const guildFetched = await guild.fetch();
                if (guildFetched.id === guildId) {
                    this.guild = guildFetched;
                }
                await guildFetched.members.fetch();
                await guildFetched.channels.fetch();
            });
            await Promise.all(fetchGuildsPromises);
            this.loadEvents();
            this.loadCommands();
            console.log(`${this.user.username} online since ${new Date().toLocaleString()}`);
        });
    }
}
