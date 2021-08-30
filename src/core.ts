import * as discordUtils from "./utils/discord";
import * as anilist from "./anilist";
import { Media, MediaType } from "./models/Media";
import { Logger } from "./Logger";

const logger = new Logger();

if (require.main == module) {
  parseMessage(":{Black Clover}: and :<<Black Clover>>:").catch(e => console.log(e));
}

export interface SearchArg {
  title: string;
  extended: boolean;
  type: MediaType
}

export function extractArgs(content: string): SearchArg[] {
  const args: SearchArg[] = [];
  content.match(discordUtils.animeExtendedRegex)?.forEach(t => {
    args.push({ title: stripTags(t), extended: true, type: MediaType.ANIME });
  });
  content.match(discordUtils.animeRegex)?.forEach(t => {
    args.push({ title: stripTags(t), extended: false, type: MediaType.ANIME });
  });
  content.match(discordUtils.mangaExtendedRegex)?.forEach(t => {
    args.push({ title: stripTags(t), extended: true, type: MediaType.MANGA });
  });
  content.match(discordUtils.mangaRegex)?.forEach(t => {
    args.push({ title: stripTags(t), extended: false, type: MediaType.MANGA });
  });

  return args;
}

export async function parseMessage(content: string): Promise<{ media: Media | undefined, arg: SearchArg }[]> {
  const args = extractArgs(content);
  logger.info(`Extracted [${args.map(a => a.title).join(",")}] searches`);

  const result: { media: Media, arg: SearchArg }[] = [];
  for (const arg of args) {
    result.push({
      media: (await anilist.searchMedia(arg.type, arg.title, 1))[0],
      arg
    });
  }

  return result;
}

export async function searchMedia(title: string, type: MediaType): Promise<Media[]> {
  return anilist.searchMedia(type, title, 5);
}

export async function getMediaById(id: number): Promise<Media | null> {
  return anilist.getMediaById(id);
}

function stripTags(query: string): string {
  return query
    .replace(":{{", "")
    .replace("}}:", "")
    .replace(":{", "")
    .replace("}:", "")
    .replace(":<<", "")
    .replace(">>:", "")
    .replace(":<", "")
    .replace(">:", "");
}
