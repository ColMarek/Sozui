import * as striptags from "striptags"

export class Media {
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

  constructor(
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
    trailerSite
  ) {
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
  }
}
