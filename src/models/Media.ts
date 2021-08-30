import * as striptags from "striptags";

export const enum MediaType {
  ANIME  = "ANIME",
  MANGA  = "MANGA"
}

export class MediaTypeUtil {
  static stringToMediaType(type: string): MediaType {
    switch (type) {
    case "ANIME":
      return MediaType.ANIME;
    case "MANGA":
      return MediaType.ANIME;
    default:
      throw new Error(`Invalid media type ${type}`);
    }
  }
}

export class Media {
  id: number
  title: string
  image: string
  description: string
  genres: string
  meanScore: string
  anilistUrl: string
  status: string
  startDate: string
  endDate: string
  episodes: string
  duration: string
  isAdult: string
  trailerUrl: string
  type: MediaType

  constructor(
    id,
    title,
    image,
    description,
    genres,
    meanScore,
    anilistUrl,
    status,
    startDate,
    endDate,
    episodes,
    duration,
    isAdult,
    trailerId,
    trailerSite,
    type: MediaType
  ) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = striptags(description);
    this.genres = genres.join().replace(",", ", ");
    this.meanScore = meanScore;
    this.anilistUrl = anilistUrl;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.episodes = episodes;
    this.duration = duration;
    this.isAdult = isAdult;
    if (trailerSite == "youtube") {
      this.trailerUrl = `https://www.youtube.com/watch?v=${trailerId}`;
    } else if (trailerSite == "dailymotion") {
      this.trailerUrl = `https://www.dailymotion.com/video/${trailerId}`;
    }
    this.type = type;
  }
}
