import { generateMessageEmbed } from "../utils/anime"
import * as winston from "winston"
import * as core from "../core"

export const cmd = {
  name: "search",
  description: "Search for anime",
  aliases: ["c"],
  usage: "<command name>",
  execute: async (message, args) => {
    const title = args.join(" ").replace(/"/gm, "");
    winston.debug(`Searching for '${title}'`);
    const results = await core.searchForTitle(title);
    const data: string[] = [];
    for (let i = 0; i < results.length; i++) {
      const media = results[i];
      data.push(`${i + 1} ${media.title}`);
    }
    winston.debug(`Found ${results.length} results`);

    const res = data.join("\n");
    const sentMessage = await message.channel.send(`"${title}"\`\`\`${res}\`\`\``);
    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
    for (let i = 0; i < results.length; i++) {
      await sentMessage.react(emojis[i]);
    }

    // Wait for 📹reaction to show trailer
    const filter = (reaction, user) => {
      return emojis.includes(reaction.emoji.name) && !user.bot;
    };
    const collector = sentMessage.createReactionCollector(filter, { max: 5, time: 5 * 60 * 1000 });
    collector.on("collect", async (reaction) => {
      const index = emojis.indexOf(reaction.emoji.name);
      if (index === -1) return;

      const media = results[index];
      winston.debug(`User selected '${media.title}'`);

      const embed = generateMessageEmbed("ANIME", media, true);

      message.channel.startTyping();
      const sentMessage = await message.channel.send(media.title, embed);
      if (media.trailerUrl) {
        await sentMessage.react("📹");
      }

      // Wait for 📹reaction to show trailer
      const filter = (reaction, user) => {
        return reaction.emoji.name === "📹" && !user.bot;
      };
      const collector = sentMessage.createReactionCollector(filter, { max: 1, time: 5 * 60 * 1000 });
      collector.on("collect", () => {
        if (media.trailerUrl) {
          message.channel.send(media.trailerUrl);
        }
      });

      await message.react("✅");
      await message.channel.stopTyping(true);
      winston.debug(`Sent reply for '${media.title}'`);
    });
  }

};
