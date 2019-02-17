module.exports = {
  generateMessageEmbed: anime => {
    const fields = [];
    fields.push({
      name: "Mean Score",
      value: anime.meanScore
    });
    fields.push({ name: "Status", value: anime.status, inline: true });
    fields.push({
      name: "Episodes",
      value: anime.episodes ? anime.episodes : "Unknown",
      inline: true
    });
    fields.push({ name: "Start Date", value: anime.startDate, inline: true });
    fields.push({ name: "End Date", value: anime.endDate, inline: true });
    fields.push({ name: "Genres", value: anime.genres, inline: false });
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
    if (anime.kitsuUrl) {
      fields.push({ name: "Kitsu URL", value: anime.kitsuUrl, inline: false });
    }
    if (anime.masteraniUrl) {
      fields.push({
        name: "Masterani URL",
        value: anime.masteraniUrl,
        inline: false
      });
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
  },
  generateMiniMessageEmbed: anime => {
    const fields = [];
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
    if (anime.kitsuUrl) {
      fields.push({ name: "Kitsu URL", value: anime.kitsuUrl, inline: false });
    }
    if (anime.masteraniUrl) {
      fields.push({
        name: "Masterani URL",
        value: anime.masteraniUrl,
        inline: false
      });
    }

    let color = 0x0cca4a;
    if (anime.isAdult) {
      color = 0xbf0909;
    }

    return {
      title: anime.title,
      // description: anime.description,
      url: anime.anilistUrl,
      color,
      thumbnail: {
        url: anime.image
      },
      fields
    };
  }
};
