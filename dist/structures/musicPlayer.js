import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, } from "@discordjs/voice";
import ytdl from "ytdl-core";
class MusicPlayer {
    connection = null;
    audioPlayer = createAudioPlayer();
    queue = [];
    playing = false;
    defaultVolume = 0.2;
    isLooping = false;
    idleTimeout = null;
    idleTimeoutDuration = 90000;
    constructor() {
        this.audioPlayer.on("stateChange", (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status === AudioPlayerStatus.Playing) {
                this.playNext();
            }
        });
        this.audioPlayer.on("error", (error) => console.error("Error playing song:", error));
    }
    toggleLoop() {
        this.isLooping = !this.isLooping;
    }
    async joinChannel(channel) {
        try {
            this.connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            this.connection.subscribe(this.audioPlayer);
            return true;
        }
        catch (error) {
            console.error("Error joining voice channel:", error);
            return false;
        }
    }
    async leaveChannel() {
        if (this.connection) {
            this.connection.destroy();
            this.connection = null;
        }
    }
    async play(url) {
        if (!this.connection)
            return null;
        const info = await ytdl.getBasicInfo(url);
        const queueItem = {
            url: url,
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
        };
        this.queue.push(queueItem);
        if (!this.playing) {
            this.playNext();
        }
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
        return queueItem;
    }
    skip() {
        if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle) {
            this.audioPlayer.stop();
            this.disconnectIfIdle();
        }
    }
    async playNext() {
        if (!this.connection || this.queue.length === 0) {
            this.playing = false;
            this.disconnectIfIdle();
            return;
        }
        this.playing = true;
        let nextSong;
        if (!this.isLooping) {
            nextSong = this.queue.shift();
        }
        else {
            nextSong = this.getCurrentSong() || this.queue.shift();
        }
        if (!nextSong) {
            this.disconnectIfIdle();
            return;
        }
        const stream = ytdl(nextSong.url, { filter: "audioonly", quality: "highestaudio" });
        const resource = createAudioResource(stream, { inlineVolume: true, metadata: nextSong });
        resource.volume?.setVolume(this.defaultVolume);
        this.audioPlayer.play(resource);
    }
    disconnectIfIdle() {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
        }
        this.idleTimeout = setTimeout(() => {
            if (!this.isPlaying()) {
                this.connection?.disconnect();
            }
            this.idleTimeout = null;
        }, this.idleTimeoutDuration);
    }
    pause() {
        this.audioPlayer.pause();
    }
    resume() {
        this.audioPlayer.unpause();
    }
    stop() {
        this.audioPlayer.stop();
        this.queue = [];
        this.playing = false;
        this.audioPlayer.state.status = AudioPlayerStatus.Idle;
        this.disconnectIfIdle();
    }
    isPlaying() {
        return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
    }
    setVolume(volume) {
        if (this.audioPlayer.state.status !== "idle") {
            const resource = this.audioPlayer.state.resource;
            if (!resource.volume) {
                console.error(`[Error code: 1738]`, resource);
                return;
            }
            resource.volume.setVolume(volume);
        }
    }
    getQueue() {
        return this.queue;
    }
    getCurrentSong() {
        if (this.audioPlayer.state.status !== "idle") {
            const resource = this.audioPlayer.state.resource;
            return resource.metadata;
        }
        return null;
    }
}
const musicPlayer = new MusicPlayer();
export default musicPlayer;
