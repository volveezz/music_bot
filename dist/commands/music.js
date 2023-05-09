import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { YouTube } from "youtube-sr";
import icons from "../configs/icons.js";
import { premiumRoles } from "../configs/roles.js";
import { Command } from "../structures/command.js";
import musicPlayer from "../structures/musicPlayer.js";
export default new Command({
    name: "music",
    description: "Управление музыкой и воспроизведением",
    descriptionLocalizations: {
        "en-US": "Music and playback control",
        "en-GB": "Music and playback control",
        ru: "Управление музыкой и воспроизведением",
    },
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "play",
            nameLocalizations: { "en-US": "play", "en-GB": "play", ru: "играть" },
            description: "Воспроизведение музыки по ссылке",
            descriptionLocalizations: { "en-US": "Play music by link", "en-GB": "Play music by link" },
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "link",
                    nameLocalizations: { "en-US": "link", "en-GB": "link", ru: "ссылка" },
                    description: "Ссылка на музыку для воспроизведения",
                    descriptionLocalizations: {
                        "en-US": "Link to the music for playback",
                        "en-GB": "Link to the music for playback",
                    },
                    required: true,
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "loop",
            nameLocalizations: { "en-US": "loop", "en-GB": "loop", ru: "повтор" },
            description: "Включить или выключить повтор текущей песни",
            descriptionLocalizations: {
                "en-US": "Toggle loop for the current song",
                "en-GB": "Toggle loop for the current song",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "skip",
            nameLocalizations: { "en-US": "skip", "en-GB": "skip", ru: "пропустить" },
            description: "Пропустить текущую песню",
            descriptionLocalizations: {
                "en-US": "Skip the current song",
                "en-GB": "Skip the current song",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "stop",
            nameLocalizations: { "en-US": "stop", "en-GB": "stop", ru: "остановить" },
            description: "Остановить воспроизведение музыки",
            descriptionLocalizations: {
                "en-US": "Stop music playback",
                "en-GB": "Stop music playback",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "leave",
            nameLocalizations: { "en-US": "leave", "en-GB": "leave", ru: "выйти" },
            description: "Выйти из голосового канала и остановить воспроизведение музыки",
            descriptionLocalizations: {
                "en-US": "Leave the voice channel and stop playing music",
                "en-GB": "Leave the voice channel and stop playing music",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "pause",
            nameLocalizations: { "en-US": "pause", "en-GB": "pause", ru: "пауза" },
            description: "Приостановить воспроизведение музыки",
            descriptionLocalizations: {
                "en-US": "Pause music playback",
                "en-GB": "Pause music playback",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "resume",
            nameLocalizations: { "en-US": "resume", "en-GB": "resume", ru: "возобновить" },
            description: "Возобновить воспроизведение музыки",
            descriptionLocalizations: {
                "en-US": "Resume music playback",
                "en-GB": "Resume music playback",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "queue",
            nameLocalizations: { "en-US": "queue", "en-GB": "queue", ru: "очередь" },
            description: "Просмотреть текущую очередь воспроизведения",
            descriptionLocalizations: {
                "en-US": "View the current playback queue",
                "en-GB": "View the current playback queue",
            },
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "volume",
            nameLocalizations: { "en-US": "volume", "en-GB": "volume", ru: "громкость" },
            description: "Изменить громкость воспроизведения (по умолчанию: 25)",
            descriptionLocalizations: {
                "en-US": "Change playback volume (default: 25)",
                "en-GB": "Change playback volume (default: 25)",
            },
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "volume",
                    nameLocalizations: { "en-US": "volume", "en-GB": "volume", ru: "громкость" },
                    description: "Уровень громкости от 1 до 100 (без ограничений для меценатов)",
                    descriptionLocalizations: {
                        "en-US": "Volume level from 1 to 100 (unlimited for supporters)",
                        "en-GB": "Volume level from 1 to 100 (unlimited for supporters)",
                    },
                    required: true,
                    minValue: 0,
                },
            ],
        },
    ],
    run: async ({ interaction, args }) => {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!member) {
            return errorReply("Вы не состоите на сервере");
        }
        const memberVoiceChannel = member.voice.channel && member.voice.channel.isVoiceBased() && member.voice.channel;
        const command = args.getSubcommand(true);
        if (!memberVoiceChannel && command !== "queue") {
            return errorReply("Вы должны находиться в голосовом канале");
        }
        switch (command) {
            case "play": {
                if (memberVoiceChannel) {
                    const musicLinkOrSearch = args.getString("link", true);
                    const success = await musicPlayer.joinChannel(memberVoiceChannel);
                    if (!success) {
                        return errorReply("Не удалось присоединиться к голосовому каналу");
                    }
                    let musicLink = musicLinkOrSearch;
                    let deferredReply;
                    if (!/^https?:\/\/\S+/.test(musicLinkOrSearch)) {
                        deferredReply = interaction.deferReply();
                        const searchResults = await YouTube.search(musicLinkOrSearch, { limit: 1 });
                        if (searchResults.length > 0) {
                            musicLink = searchResults[0].url;
                        }
                        else {
                            return errorReply("Не удалось найти музыку по названию");
                        }
                    }
                    const queueItem = await musicPlayer.play(musicLink);
                    if (queueItem) {
                        const successEmbed = new EmbedBuilder()
                            .setThumbnail(queueItem.thumbnail)
                            .setTitle("В очередь добавлена музыка")
                            .setColor("#ff7624")
                            .setAuthor({ name: queueItem.title, url: queueItem.url })
                            .setThumbnail(queueItem.thumbnail);
                        if (deferredReply) {
                            await deferredReply;
                            await interaction.editReply({ embeds: [successEmbed] });
                        }
                        else {
                            await interaction.reply({ embeds: [successEmbed] });
                        }
                    }
                    else {
                        return errorReply("Не удалось найти музыку по ссылке");
                    }
                }
                else {
                    return errorReply("Вы должны быть в голосовм канале");
                }
                break;
            }
            case "loop": {
                if (musicPlayer.isPlaying()) {
                    musicPlayer.toggleLoop();
                    const loopStatus = musicPlayer.isLooping ? "включен" : "выключен";
                    const embed = new EmbedBuilder()
                        .setColor("#28A745")
                        .setAuthor({ name: `Повтор песни ${loopStatus}`, iconURL: icons.success });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                else {
                    const embed = new EmbedBuilder().setColor("#0077C9").setAuthor({ name: "Нет песен для повтора", iconURL: icons.notify });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            }
            case "leave": {
                await musicPlayer.leaveChannel();
                musicPlayer.stop();
                const embed = new EmbedBuilder().setColor("#ff7624").setTitle("Воспроизведение музыки прекращено");
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }
            case "stop": {
                if (musicPlayer.isPlaying()) {
                    musicPlayer.stop();
                    const embed = new EmbedBuilder().setColor("#ff7624").setTitle("Воспроизведение музыки прекращено");
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                else {
                    const embed = new EmbedBuilder().setColor("#FFC107").setTitle("Нет песен для остановки");
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            }
            case "skip": {
                if (musicPlayer.isPlaying()) {
                    musicPlayer.skip();
                    const embed = new EmbedBuilder().setColor("#28A745").setAuthor({ name: "Текущая песня пропущена", iconURL: icons.success });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                else {
                    const embed = new EmbedBuilder().setColor("#0077C9").setAuthor({ name: "Нет песен для пропуска", iconURL: icons.notify });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            }
            case "pause": {
                if (musicPlayer.isPlaying()) {
                    musicPlayer.pause();
                    const embed = new EmbedBuilder()
                        .setColor("#0077C9")
                        .setAuthor({ name: "Воспроизведение музыки приостановлено", iconURL: icons.notify });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                else {
                    const embed = new EmbedBuilder().setColor("#FFC107").setTitle("Нет песен для приостановки");
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            }
            case "resume": {
                if (!musicPlayer.isPlaying()) {
                    musicPlayer.resume();
                    const embed = new EmbedBuilder()
                        .setColor("#28A745")
                        .setAuthor({ name: "Воспроизведение музыки продолжено", iconURL: icons.success });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                else {
                    const embed = new EmbedBuilder().setColor("#FFC107").setTitle("Музыка уже воспроизводится");
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            }
            case "volume": {
                if (musicPlayer.isPlaying()) {
                    const volume = args.getInteger("volume", true) / 100;
                    const isMemberPremium = member.permissions.has("Administrator") ||
                        member.roles.cache.hasAny(...premiumRoles.filter((r) => r.tier >= 3).map((r) => r.roleId));
                    const newVolume = volume > 1 && isMemberPremium ? volume : volume <= 1 ? volume : 1;
                    musicPlayer.setVolume(newVolume);
                    const embed = new EmbedBuilder().setColor("#28A745").setAuthor({
                        name: `Установлена громкость на ${newVolume * 100}%${!isMemberPremium ? "/100%" : ""}`,
                        iconURL: icons.success,
                    });
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                else {
                    const embed = new EmbedBuilder().setColor("#FFC107").setTitle("Нет песен для изменения громкости");
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            }
            case "queue": {
                const queue = musicPlayer.getQueue();
                const currentSong = musicPlayer.getCurrentSong();
                let queueString = "";
                const embed = new EmbedBuilder().setColor("#ff7624").setTitle("Очередь воспроизведения");
                if (currentSong) {
                    queueString += `**Сейчас играет:** [${currentSong.title}](${currentSong.url})\n\n`;
                    embed.setThumbnail(currentSong.thumbnail);
                }
                if (queue.length) {
                    queueString += "**Очередь:**\n" + queue.map((item, index) => `**${index + 1}.** [${item.title}](${item.url})`).join("\n");
                }
                else {
                    queueString += "Очередь пуста";
                }
                embed.setDescription(queueString);
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }
            default: {
                await interaction.reply("Unknown command");
            }
        }
        async function errorReply(name, description) {
            const embed = new EmbedBuilder()
                .setColor("#DC3545")
                .setAuthor({ name: name, iconURL: icons.error })
                .setDescription(description || null);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
});
