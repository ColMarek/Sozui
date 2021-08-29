import { extractArgs, SearchArg } from "./core";
import { MediaType } from "./models/Media";

describe("core.ts", () => {
  it("can extractArgs", () => {
    const args = extractArgs(":{{Anime1}}: and :{Anime2}: and :{Anime3}: and :<<Manga 1>>: :<Manga 2>:");

    const result: SearchArg[] = [
      { title: "Anime2", type: MediaType.ANIME, extended: true },
      { title: "Anime3", type: MediaType.ANIME, extended: true },
      { title: "Anime1", type: MediaType.ANIME, extended: false },
      { title: "Manga 2", type: MediaType.MANGA, extended: true },
      { title: "Manga 1", type: MediaType.MANGA, extended: false }
    ];
    expect(args).toEqual(result);
  });
});
