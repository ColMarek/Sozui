import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandHandler } from "../models/CommandHandler";
import { CommandInteraction } from "discord.js";

export const cmd: CommandHandler = {
  name: "help",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("How to use the bod"),
  execute: async (interaction: CommandInteraction) => {
    const data: string[] = [];

    data.push("You can link anime/manga using:");
    data.push("```");
    data.push("Anime (detailed)  ->  :{anime title}:");
    data.push("Anime             ->  :{{anime title}}:");
    data.push("Manga (detailed)  ->  :<manga title>:");
    data.push("Manga             ->  :<<manga title>>:");
    data.push("```");

    await interaction.reply(data.join("\n"));
  }
};
