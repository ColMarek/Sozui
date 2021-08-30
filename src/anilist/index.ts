import { default as axios } from "axios";
import { Media, MediaType, MediaTypeUtil } from "../models/Media";
import { Logger } from "../Logger";

const BASE_URL = "https://graphql.anilist.co";
const logger = new Logger();

const mediaData = `
fragment mediaData on Media {
  id
  title {
    romaji
    english
  }
  coverImage {
    extraLarge
  }
  description(asHtml: false)
  genres
  meanScore
  siteUrl
  type
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
`;

export async function searchMedia(type: MediaType, title: string, count: number): Promise<Media[]> {
  const query = `
	query {
    Page(page: 1, perPage: ${count}) {
      media(sort: SEARCH_MATCH, type: ${type}, search:"${title}") {
        ...mediaData
      }
    }
  }
  
  ${mediaData}`;

  try {
    logger.info(`Searching for ${type} ${title}`, "searchMedia");
    const response = await axios.post(BASE_URL, { query });
    const media = response.data.data.Page.media;
    if (media.length > 0) {
      logger.info(`Found ${media.title}`);
      return media.map(a => anilistResponseToMedia(a, type));
    } else {
      logger.info(`Found 0 results for ${title} ${type}`, "searchMedia");
      return [];
    }
  } catch (e) {
    const message = e.response ? e.response.data.errors[0].message : e.message;
    throw new Error(message);
  }
}

export async function getMediaById(id: number): Promise<Media | null> {
  const query = `
  query {
    Media(id: ${id}) {
    ...mediaData
    }
  }
  
  ${mediaData}`;

  try {
    logger.info(`Getting for media ${id}`, "getMediaById");
    const response = await axios.post(BASE_URL, { query });
    const res = response.data.data.Media;
    logger.info(`Found ${res.type} ${res.title.romaji}`, "getMediaById");
    return anilistResponseToMedia(res, MediaTypeUtil.stringToMediaType(res.type));
  } catch (e) {
    if (e.response?.data.errors[0].message == "Not Found.") {
      return null;
    }

    const message = e.response ? e.response.data.errors[0].message : e.message;
    throw new Error(message);
  }
}

function anilistResponseToMedia(res, type: MediaType): Media {
  return new Media(res.id,
    res.title.romaji,
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
