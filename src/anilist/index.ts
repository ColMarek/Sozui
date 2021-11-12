import { default as axios } from "axios";
import { Media, MediaType, MediaTypeUtil } from "../models/Media";
import { Logger } from "../utils/Logger";

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
    logger.debug(`Searching for ${type} ${title}`, "searchMedia");
    const response = await axios.post(BASE_URL, { query });
    const media = response.data.data.Page.media;
    if (media.length > 0) {
      logger.debug(`Found [${media.map(r => r.title.romaji).join(",")}]`, "searchMedia");
      return media.map(a => anilistResponseToMedia(a, type));
    } else {
      logger.debug(`Found 0 results for ${title} ${type}`, "searchMedia");
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
    logger.debug(`Getting for media ${id}`, "getMediaById");
    const response = await axios.post(BASE_URL, { query });
    const res = response.data.data.Media;
    logger.debug(`Found ${res.type} ${res.title.romaji}`, "getMediaById");
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
    parseDate(res.startDate.day, res.startDate.month, res.startDate.year),
    parseDate(res.endDate.day,res.endDate.month, res.endDate.year),
    res.episodes,
    res.duration,
    res.isAdult,
    res.trailer ? res.trailer.id : null,
    res.trailer ? res.trailer.site : null,
    type);
}

function parseDate(day, month, year) {
  let date = "";
  if (day && month) {
    date = `${day}-${month}`;
  }
  if (year) {
    if (date.length > 0) {
      date = `${date}-${year}`;
    } else {
      date = year;
    }
  }

  return date === "" ? null : date.toString();
}

