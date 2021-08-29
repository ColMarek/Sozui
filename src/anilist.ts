import { default as axios } from "axios";
import { Media, MediaType } from "./models/Media";
import { Logger } from "./Logger";

const BASE_URL = "https://graphql.anilist.co";
const logger = new Logger();

export async function searchMedia(type: MediaType, title: string, count: number): Promise<Media[]> {
  const query = `
	query{
		Page(page: 1, perPage: ${count}) {
			media(sort: SEARCH_MATCH, type: ${type}, search:"${title}") {
				title {
					romaji
				}
				coverImage{
					extraLarge
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
        trailer {
          id
          site
        }
			}
		}
	}
  `;

  try {
    logger.info(`Searching for ${title} ${type}`);
    const response = await axios.post(BASE_URL, { query });
    const media = response.data.data.Page.media;
    if (media.length > 0) {
      return media.map(a => anilistResponseToMedia(a, media));
    } else {
      logger.info(`Found 0 results for ${title} ${type}`);
      return [];
    }
  } catch (e) {
    const message = e.response ? e.response.data.errors[0].message : e.message;
    throw new Error(message);
  }
}

function anilistResponseToMedia(res, type: MediaType): Media {
  return new Media( res.title.romaji,
    res.coverImage.extraLarge,
    res.description,
    res.genres,
    res.meanScore,
    res.siteUrl,
    res.status,
    `${res.startDate.day}-${res.startDate.month}-${res.startDate.year}`,
    `${res.endDate.day}-${res.endDate.month}-${res.endDate.year}`,
    res.episodes,
    res.duration,
    res.isAdult,
    res.trailer ? res.trailer.id : null,
    res.trailer ? res.trailer.site : null,
    type);
}
