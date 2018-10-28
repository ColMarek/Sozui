const winston = require("winston");
const animeSearch = require("../core/animeSearch");
const { generateMessageEmbed } = require("../utils/anime");

module.exports = {
  name: "anime-extended",
  aliases: ["ae"],
  description: "Returns extended details on an anime",
  args: true,
  usage: "<anime title>",
  execute: async (message, args) => {
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

    const embed = generateMessageEmbed(anime);

    await message.channel.send(anime.title, {
      embed
    });
    winston.debug(`Sent reply for '${query}'`);
  }
};
