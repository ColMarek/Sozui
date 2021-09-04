import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandHandler } from "../../models/CommandHandler";
import { CommandInteraction } from "discord.js";

export const cmd: CommandHandler = {
  name: "info",
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Information about the bot"),
  execute: async (interaction: CommandInteraction) => {
    const data: string[] = [];
    data.push("I am a bot that you can use to link anime and manga. Use /help for info");
    data.push("**Developer**: ColMarek");
    data.push("**Source Code**: https://github.com/ColMarek/Sozui");

    await interaction.reply(data.join("\n"));
  },
};
