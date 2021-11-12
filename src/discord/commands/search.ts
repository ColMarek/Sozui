import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { CommandHandler } from "../../models/CommandHandler";
import { SlashCommandBuilder } from "@discordjs/builders";
import { searchMedia } from "../../core";
import { MediaType } from "../../models/Media";
import { Logger } from "../../utils/Logger";

const logger = new Logger();

export const cmd: CommandHandler = {
  name: "search",
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search for anime/manga")
    .addStringOption(opt => opt.setName("query")
      .setDescription("The search query")
      .setRequired(true))
    .addBooleanOption(opt => opt.setName("is-anime")
      .setDescription("True for anime, false for manga")),
  execute: async (interaction: CommandInteraction) => {
    let isAnime = true;
    if (interaction.options.getBoolean("is-anime") != null) {
      isAnime = interaction.options.getBoolean("is-anime") as boolean;
    }
    const query = interaction.options.getString("query") as string;

    try {
      const mediaType = isAnime ? MediaType.ANIME : MediaType.MANGA;
      const medias = await searchMedia(query, mediaType);
      if (medias.length == 0) {
        await interaction.reply(`No ${mediaType.toLowerCase()} results found for ${query}`);
        return;
      }

      const numberedMediaTitles = medias.map((m, i) => {
        let line =  `${i + 1} - ${m.title}`;

        if (m.startDate) {
          if (m.startDate.match(/\d+-\d+-\d{4}/)) {
            line += ` (${m.startDate.split("-")[2]})`;
          } else {
            line += ` (${m.startDate})`;
          }
        }

        return line;
      });

      const row = new MessageActionRow();
      for (let i = 0; i < medias.length; i++) {
        const media = medias[i];
        row.addComponents(new MessageButton()
          .setCustomId(media.id.toString())
          .setLabel((i + 1).toString())
          .setStyle("SECONDARY"));
      }

      await interaction.reply({ content: numberedMediaTitles.join("\n"), components: [row] });
    } catch (e) {
      logger.error(e.message, e, "search");
      await interaction.reply("There was an error while executing this command!");
    }
  }

};
