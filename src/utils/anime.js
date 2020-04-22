const Discord = require("discord.js");

/**
 *
 * @param {} anime
 * @param {boolean} extended
 */
function generateMessageEmbed(anime, extended) {
  const fields = [];
  if (extended) {
    fields.push({
      name: "Mean Score",
      value: anime.meanScore
    });
    if (anime.episodes) {
      fields.push({
        name: "Episodes",
        value: anime.episodes
      });
    }
    fields.push({ name: "Status", value: anime.status, inline: true });
    fields.push({ name: "Start Date", value: anime.startDate, inline: true });
    fields.push({ name: "End Date", value: anime.endDate, inline: true });
    fields.push({ name: "Genres", value: anime.genres, inline: false });
  }
  if (anime.isAdult) {
    fields.push({ name: "NSFW", value: "true", inline: false });
  }
  fields.push({
    name: "Anilist URL",
    value: anime.anilistUrl,
    inline: false
  });
  fields.push({
    name: "MyAnimeList URL",
    value: anime.malUrl,
    inline: false
  });

  let color = 0x0cca4a;
  if (anime.isAdult) {
    color = 0xbf0909;
  }

  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(anime.title)
    .setURL(anime.anilistUrl)
    .setThumbnail(anime.image)
    .addFields(fields);
  if (extended) {
    embed.setDescription(anime.description);
  }

  return embed;
}

module.exports = {
  generateMessageEmbed
};
