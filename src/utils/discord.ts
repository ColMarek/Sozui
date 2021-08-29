import { CommandInteraction, Message } from "discord.js";

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

export function createLogFromInteraction(interaction: CommandInteraction): string {
  const guild = interaction.guild ? `${interaction.guild.name} -> ` : "";
  const user = `${interaction.user.tag} -> `;
  const command = `/${interaction.commandName}`;
  const options = interaction.options.data.length > 0 ?
    interaction.options.data.map(d => `(${d.name}:${d.value})`) : "";

  return `${guild}${user}${command} ${options}`.trim();
}

export function createLogFromMessage(message: Message): string {
  const guild = message.guild ? `${message.guild.name} -> ` : "";
  const user = `${message.author.tag} -> `;
  const content = message.content;
  return `${guild}${user}${content}`.trim();
}
