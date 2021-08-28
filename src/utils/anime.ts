import * as Discord from "discord.js"
import {Media} from "../models/Media"

/**
 *
 * @param {string} type ANIME or MANGA
 * @param {Media} media
 * @param {boolean} extended
 */
export function generateMessageEmbed(type, media, extended) {
  const fields: any[] = [];
  if (extended) {
    fields.push({
      name: "Mean Score",
      value: media.meanScore
    });
    if (media.episodes) {
      fields.push({
        name: "Episodes",
        value: media.episodes
      });
    }
    fields.push({ name: "Status", value: media.status, inline: true });
    fields.push({ name: "Start Date", value: media.startDate, inline: true });
    if (!media.endDate.match(/.*null.*/g)) {
      fields.push({ name: "End Date", value: media.endDate, inline: true });
    }
  }
  if (media.genres) {
    fields.push({ name: "Genres", value: media.genres, inline: false });
  }
  if (media.isAdult) {
    fields.push({ name: "NSFW", value: "true", inline: false });
  }

  let color = 0x0cca4a;
  if (media.isAdult) {
    color = 0xbf0909;
  } else if (type == "MANGA") {
    color = 0x0c4ec9;
  }

  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(media.title)
    .setURL(media.anilistUrl)
    .setThumbnail(media.image)
    .addFields(fields);
  if (extended) {
    embed.setDescription(media.description);
  }

  return embed;
}

