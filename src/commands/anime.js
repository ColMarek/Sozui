const winston = require("winston");
const animeSearch = require("./../core/animeSearch");

function generateMessageEmbed(anime) {
  const fields = [];
  fields.push({
    name: "Mean Score",
    value: anime.meanScore
  });
  fields.push({ name: "Status", value: anime.status, inline: true });
  fields.push({ name: "Episodes", value: anime.episodes, inline: true });
  fields.push({ name: "Start Date", value: anime.startDate, inline: true });
  fields.push({ name: "End Date", value: anime.endDate, inline: true });
  fields.push({ name: "Genres", value: anime.genres, inline: false });
  if (anime.isAdult) {
    fields.push({ name: "NSFW", value: "true", inline: false });
  }
  fields.push({
    name: "MyAnimeList URL",
    value: anime.malUrl,
    inline: false
  });
  if (anime.kitsuUrl) {
    fields.push({ name: "Kitsu URL", value: anime.kitsuUrl, inline: false });
  }

  let color = 0x0cca4a;
  if (anime.isAdult) {
    color = 0xbf0909;
  }

  return {
    title: anime.title,
    description: anime.description,
    url: anime.anilistUrl,
    color,
    thumbnail: {
      url: anime.image
    },
    fields
  };
}

module.exports = {
  name: "anime",
  description: "Returns details on an anime",
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
  },
  generateMessageEmbed
};
