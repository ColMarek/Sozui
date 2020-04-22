const winston = require("winston");
const { generateMessageEmbed } = require("../utils/anime");
const animeSearch = require("./animeSearch");

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
      message.channel.stopTyping(true);
      winston.debug(`Sent reply for '${query}'`);
    } catch (e) {
      message.channel.stopTyping();
      winston.error(e);
      message.react("❗");
    }
  });
}

module.exports = {
  handleAnimeSearch
};
