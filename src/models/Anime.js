const striptags = require("striptags");

class Anime {
  /**
   *
   * @param {String} title User preferred anime title
   * @param {String} image Url of cover image. Medium size
   * @param {String} description Description
   * @param {String[]} genres A list of genres
   * @param {Number} meanScore Mean score on Anilist
   * @param {String} anilistUrl Url on Anilist
   * @param {String} malId Id on MyAnimeList
   * @param {String} kitsuUrl Url on Kitsu
   * @param {String} status Current releasing status
   * @param {String} startDate First official release date of the anime
   * @param {String} endDate Last official release date of the anime
   * @param {Number} episodes The number of episode the anime had when it was completed.
   * @param {Number} duration The length of each episode
   * @param {Boolean} isAdult If the media is intended for 18+ audiences
   */
  constructor(
    title,
    image,
    description,
    genres,
    meanScore,
    anilistUrl,
    malId,
    kitsuUrl,
    status,
    startDate,
    endDate,
    episodes,
    duration,
    isAdult
  ) {
    this.title = title;
    this.image = image;
    this.description = striptags(description);
    this.genres = genres.join().replace(",", ", ");
    this.meanScore = meanScore;
    this.anilistUrl = anilistUrl;
    this.malUrl = "http://myanimelist.net/anime/" + malId;
    this.kitsuUrl = kitsuUrl;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.episodes = episodes;
    this.duration = duration;
    this.isAdult = isAdult;
  }
}

module.exports = Anime;
