const axios = require("axios").default;

const BASE_URL = "https://graphql.anilist.co";

/**
 * Searches Anilist for the specified anime
 * @param {String} title Anime title
 */
async function searchAnime(title) {
  return searchMedia("ANIME", title);
}

/**
 * Searches Anilist for the specified manga
 * @param {String} title Manga title
 */
async function searchManga(title) {
  return searchMedia("MANGA", title);
}

/**
 *
 * @param {string} media ANIME or MANGA
 * @param {string} title Media title
 */
async function searchMedia(media, title) {
  const query = `
	query{
		Page(page: 1, perPage: 1) {
			media(sort: SEARCH_MATCH, type: ${media}, search:"${title}") {
        idMal
				title {
					romaji
				}
				coverImage{
					large
				}
				description(asHtml:false)
        genres
        meanScore
        siteUrl
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        episodes
        duration
        isAdult
			}
		}
	}
  `;

  try {
    const response = await axios.post(BASE_URL, { query });
    const a = response.data.data.Page.media[0];

    return a;
  } catch (e) {
    const message = e.response ? e.response.data.errors[0].message : e.message;
    throw new Error(message);
  }
}

module.exports = {
  searchAnime,
  searchManga
};
