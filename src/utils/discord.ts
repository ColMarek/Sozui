import {
  ButtonInteraction,
  CommandInteraction,
  EmbedFieldData,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton
} from "discord.js";
import { Media } from "../models/Media";

export const animeExtendedRegex = /:{[^{](.*?)[^}]}:/g; // :{anime title}:

export const animeRegex = /:{{(.*?)}}:/g; // :{{anime title}}:

export const mangaExtendedRegex = /:<[^<](.*?)[^>]>:/g; // :<manga title>:

export const mangaRegex = /:<<(.*?)>>:/g; // :<<manga title>>:

export function isValidMessage(message: Message): boolean {
  if (message.author.bot) {
    // Ignore messages from bots
    return false;
  } else if (message.content.match(animeRegex)) {
    // If the message contains text wrapped in curly braces, it's valid
    return true;
  } else if (message.content.match(animeExtendedRegex)) {
    // If the message contains text wrapped in double curly braces, it's valid
    return true;
  } else if (message.content.match(mangaRegex)) {
    // If the message contains text wrapped in angled braces, it's valid
    return true;
  } else if (message.content.match(mangaExtendedRegex)) {
    // If the message contains text wrapped in double angled braces, it's valid
    return true;
  } else {
    return false;
  }
}

export function generateMessageEmbed(media: Media, extended: boolean): { embed: MessageEmbed, row: MessageActionRow|null } {
  const fields: EmbedFieldData[] = [];
  if (extended) {
    fields.push({
      name: "Mean Score",
      value: media.meanScore.toString()
    });
    if (media.episodes) {
      fields.push({
        name: "Episodes",
        value: media.episodes.toString()
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
  } else if (media.type == "MANGA") {
    color = 0x0c4ec9;
  }

  const row = new MessageActionRow();
  if (media.trailerUrl) {
    row.addComponents(new MessageButton()
      .setURL(media.trailerUrl)
      .setLabel("Trailer")
      .setStyle("LINK"));
  }

  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(media.title)
    .setURL(media.anilistUrl)
    .setThumbnail(media.image)
    .addFields(fields);
  if (extended) {
    embed.setDescription(media.description);
  }

  return { embed, row: row.components.length > 0 ? row : null };
}

export function createLogFromCommandInteraction(interaction: CommandInteraction): string {
  const guild = interaction.guild ? `${interaction.guild.name} -> ` : "";
  const user = `${interaction.user.tag} -> `;
  const command = `/${interaction.commandName}`;
  const options = interaction.options.data.length > 0 ?
    interaction.options.data.map(d => `(${d.name}:${d.value})`) : "";

  return `${guild}${user}${command} ${options}`.trim();
}

export function createLogFromButtonInteraction(interaction: ButtonInteraction): string {
  const guild = interaction.guild ? `${interaction.guild.name} -> ` : "";
  const user = `${interaction.user.tag} -> `;
  const id = `btn:${interaction.customId}`;

  return `${guild}${user}${id}`.trim();
}

export function createLogFromMessage(message: Message): string {
  const guild = message.guild ? `${message.guild.name} -> ` : "";
  const user = `${message.author.tag} -> `;
  const content = message.content;
  return `${guild}${user}${content}`.trim();
}
