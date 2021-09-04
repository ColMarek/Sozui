import { InteractionCreate } from "../../models/EventHandler";
import { ButtonInteraction, Client, Collection, CommandInteraction } from "discord.js";
import { CommandHandler } from "../../models/CommandHandler";
import { Logger } from "../../utils/Logger";
import { getMediaById } from "../../core";
import {
  createLogFromButtonInteraction,
  createLogFromCommandInteraction, generateMessageEmbed
} from "../../utils/discord";

const logger = new Logger();

export const event: InteractionCreate = {
  name: "interactionCreate",
  once: false,
  execute: async (client: Client, commands: Collection<string, CommandHandler>, interaction: CommandInteraction | ButtonInteraction) => {
    if (interaction.isCommand()) {
      await handleCommand(interaction, commands);
    } else if (interaction.isButton()) {
      await handleButton(interaction);
    }
  }
};

async function handleCommand(interaction: CommandInteraction, commands: Collection<string, CommandHandler>) {
  const msg = createLogFromCommandInteraction(interaction);
  logger.info(msg, "handleCommand");

  const command = commands.get(interaction.commandName);

  if (!command) {
    logger.error(`Command not found for ${interaction.commandName}`, undefined, "handleCommand");
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error.message, undefined, "handleCommand");
    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
}

async function handleButton(interaction: ButtonInteraction) {
  try {
    const msg = createLogFromButtonInteraction(interaction);
    logger.info(msg, "handleButton");

    const media = await getMediaById(parseInt(interaction.customId));
    if (media == null) {
      await interaction.reply("Response was unexpectedly null");
      return;
    }

    const embed = generateMessageEmbed(media, true);

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    logger.error(error.message, undefined, "handleButton");
    await interaction.reply({ content: "There was an error handling that button!", ephemeral: true });
  }
}
