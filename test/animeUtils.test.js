const assert = require("chai").assert;
const animeUtils = require("./../src/utils/anime");
const Anime = require("./../src/models/Anime");

const anime = new Anime(
  "title",
  "image",
  "description",
  ["genre 1"],
  1,
  "anilistUrl",
  "malId",
  "kitsuUrl",
  "status",
  "startDate",
  "endDate",
  1,
  1,
  false
);

describe("anime utils", () => {
  it("should convert anime to embed message", () => {
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

    let color = 0x0cca4a;
    if (anime.isAdult) {
      color = 0xbf0909;
    }

    const expected = {
      title: anime.title,
      description: anime.description,
      url: anime.anilistUrl,
      color,
      thumbnail: {
        url: anime.image
      },
      fields
    };

    const actual = animeUtils.generateMessageEmbed(anime);

    assert.deepEqual(actual.fields, expected.fields);
  });

  it("should convert anime to a mini embed message", () => {
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

    let color = 0x0cca4a;
    if (anime.isAdult) {
      color = 0xbf0909;
    }

    const expected = {
      title: anime.title,
      url: anime.anilistUrl,
      color,
      thumbnail: {
        url: anime.image
      },
      fields
    };
    const actual = animeUtils.generateMiniMessageEmbed(anime);

    assert.deepEqual(actual.fields, expected.fields);
  });
});
