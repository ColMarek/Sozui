const axios = require("axios").default;

const API_URL = " https://www.masterani.me/api/anime/search";

/**
 * Searches Masterani for the anime specified
 * @param {String} title Anime title
 * @returns {String} The url of the anime on Masterani
 */
async function searchAnime(title) {
  const query = `${API_URL}?search=${title.toLowerCase()}&sb=true`;
  const response = await axios.get(query);

  const materaniUrl =
    "https://www.masterani.me/anime/info/" + response.data[0].slug;

  return materaniUrl;
}

module.exports = {
  searchAnime
};
