const axios = require("axios").default;

const BASE_URL = "https://graphql.anilist.co";

/**
 * Searches Anilist for the specified anime
 * @param {String} title Anime title
 */
async function searchAnime(title) {
  const query = `
	query{
		Page(page: 1, perPage: 1) {
			media(sort: POPULARITY_DESC, type: ANIME, search:"${title}") {
        idMal
				title {
					userPreferred
				}
				coverImage{
					medium
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

  const response = await axios.post(BASE_URL, { query });
  const a = response.data.data.Page.media[0];

  return a;
}

module.exports = {
  searchAnime
};
