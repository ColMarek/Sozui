const axios = require("axios").default;

const API_URL = "https://kitsu.io/api/edge/";

/**
 * Searches Kitsu for the anime specified
 * @param {String} title Anime title
 * @returns {String} The url of the anime on Kitsu
 */
async function searchAnime(title) {
  const query = `${API_URL}anime?filter[text]=${title}&page[limit]=1&page[offset]=0`;
  const response = await axios.get(query);
  const kitsuUrl =
    "https://kitsu.io/anime/" + response.data.data[0].attributes.slug;

  return kitsuUrl;
}

module.exports = {
  searchAnime
};
