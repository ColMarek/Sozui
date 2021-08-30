import { MessageCreateEvent } from "../models/EventHandler";
import { createLogFromMessage, isValidMessage } from "../utils/discord";
import { Client, Collection, Message } from "discord.js";
import { CommandHandler } from "../models/CommandHandler";
import { Logger } from "../Logger";
import { parseMessage } from "../core";
import { generateMessageEmbed } from "../utils/anime";

const logger = new Logger();

export const event: MessageCreateEvent = {
  name: "messageCreate",
  once: false,
  execute: async (client: Client, commands: Collection<string, CommandHandler>, message: Message) => {
    try {
      if (!isValidMessage(message)) {
        return;
      }

      const log = createLogFromMessage(message);
      logger.info(log);

      const result = await parseMessage(message.content);

      const embeds = result
        .filter(r => r.media !== undefined)
        .map(r => generateMessageEmbed(r.media!, r.arg.extended));

      await message.channel.sendTyping();
      for (const embed of embeds) {
        await message.channel.send({ embeds: [embed] });
      }

      const missingSearches = result.filter(r => r.media === undefined)
        .map(r => `I was unable to find any ${r.arg.type.toLowerCase()} called ${r.arg.title}`);
      for (const missingSearch of missingSearches) {
        await message.channel.send(missingSearch);
      }

    } catch (e) {
      logger.error(e.message, e);
      await message.reply("There was an error responding!");
    }
  }
};
