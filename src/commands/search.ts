import { CommandInteraction } from "discord.js";
import { CommandHandler } from "../models/CommandHandler";
import { SlashCommandBuilder } from "@discordjs/builders";

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
    const isAnime = interaction.options.getBoolean("is-anime") ? interaction.options.getBoolean("is-anime") : false;
    const query = interaction.options.getString("query") as string;
    await interaction.reply(`${query}, ${isAnime}`);
  }

};
