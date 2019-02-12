const winston = require("winston");
const animeSearch = require("./../core/animeSearch");
const { generateMiniMessageEmbed } = require("./../utils/anime");

module.exports = {
  name: "anime",
  description: "Returns details on an anime",
  args: true,
  usage: "<anime title>",
  execute: async (message, args) => {
    // Combine args in to a single string
    let query = "";
    args.forEach(arg => {
      query += arg;
      query += " ";
    });
    query = query.trim();

    const anime = await animeSearch(query);
    if (!anime) {
      message.channel.send(`I was unable to find any anime called *${query}*`);
    }

    const embed = generateMiniMessageEmbed(anime);

    await message.channel.send(anime.title, {
      embed
    });
    winston.debug(`Sent reply for '${query}'`);
  }
};
