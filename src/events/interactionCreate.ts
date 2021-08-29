import { InteractionCreate } from "../models/EventHandler";
import { Client, Collection, CommandInteraction } from "discord.js";
import { CommandHandler } from "../models/CommandHandler";
import { Logger } from "../Logger";
import { createLogFromInteraction } from "../utils/discord";

const logger = new Logger();

export const event: InteractionCreate = {
  name: "interactionCreate",
  once: false,
  execute: async (client: Client,  commands: Collection<string, CommandHandler>, interaction: CommandInteraction) => {
    const msg = createLogFromInteraction(interaction);
    logger.info(msg);

    if (interaction.isCommand()) {
      const command = commands.get(interaction.commandName);

      if (!command) {
        logger.error(`Command not found for ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error(error.message);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    }
  }
};
