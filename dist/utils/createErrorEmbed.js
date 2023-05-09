import { EmbedBuilder } from "discord.js";
import icons from "../configs/icons.js";
function createErrorEmbed({ name, description }) {
    const embeds = [new EmbedBuilder().setColor("#DC3545").setDescription(description || null)];
    embeds[0].setAuthor({
        name: name || "Произошла ошибка. Попробуйте позже",
        iconURL: icons.error,
    });
    return {
        embeds,
    };
}
export default createErrorEmbed;
