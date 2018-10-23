const anilist = require("./../core/anilist");
const kitsu = require("./../core/kitsu");
const Anime = require("./../models/Anime");

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

    const a = await anilist.searchAnime(query);
    const kt = await kitsu.searchAnime(a.title.userPreferred);

    const anime = new Anime(
      a.title.userPreferred,
      a.coverImage.medium,
      a.description,
      a.genres,
      a.meanScore,
      a.siteUrl,
      a.idMal,
      kt,
      a.status,
      `${a.startDate.day}-${a.startDate.month}-${a.startDate.year}`,
      `${a.endDate.day}-${a.endDate.month}-${a.endDate.year}`,
      a.episodes,
      a.duration,
      a.isAdult
    );

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
    fields.push({ name: "Kitsu URL", value: anime.kitsuUrl, inline: false });

    let color = 0x0cca4a;
    if (anime.isAdult) {
      color = 0xbf0909;
    }

    await message.channel.send(anime.title, {
      embed: {
        title: anime.title,
        description: anime.description,
        url: anime.anilistUrl,
        color,
        thumbnail: {
          url: anime.image
        },
        fields
      }
    });
  }
};
