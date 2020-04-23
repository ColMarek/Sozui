const winston = require("winston");
const { generateMessageEmbed } = require("../utils/anime");
const discordUtils = require("../utils/discord");
const animeSearch = require("./animeSearch");
// eslint-disable-next-line no-unused-vars
const Discord = require("discord.js");

/**
 * Check if a message contains a bracket link and handle if it does.
 * @param {Discord.Message} message
 * @returns {boolean} True if the message has been handled
 */
async function checkAndHandleBracketsSearch(message) {
  // Handle :{{anime title}}:
  const foundExtended = message.content.match(discordUtils.animeExtendedRegex);
  if (foundExtended) {
    await handleAnimeSearch(foundExtended, message, true);
    return;
  }
  // Handle :{anime title}:
  const found = message.content.match(discordUtils.animeRegex);
  if (found) {
    await handleAnimeSearch(found, message, false);
    return;
  }
}

/**
 *
 * @param {RegExpMatchArray} found
 * @param {Discord.Message} message
 * @param {boolean} extended
 */
async function handleAnimeSearch(found, message, extended) {
  // Repeat for as many strings found
  found.forEach(async query => {
    // Remove brackets
    if (extended) {
      query = query.replace(":{{", "");
      query = query.replace("}}:", "");
    } else {
      query = query.replace(":{", "");
      query = query.replace("}:", "");
    }
    query = query.trim();

    if (query === "") {
      return;
    }

    try {
      const anime = await animeSearch(query);
      if (!anime) {
        message.channel.send(`I was unable to find any anime called *${query}*`);
        return;
      }

      const embed = generateMessageEmbed(anime, extended);

      message.channel.startTyping();
      await message.channel.send(anime.title, embed);
      await message.react("✅");
      await message.channel.stopTyping(true);
      winston.debug(`Sent reply for '${query}'`);
    } catch (e) {
      await message.react("❗");
      await message.channel.stopTyping();
      winston.error(e);
    }
  });
}

module.exports = {
  checkAndHandleBracketsSearch
};
