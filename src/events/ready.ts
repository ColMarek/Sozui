import { ReadyEvent } from "../models/EventHandler";
import { Client } from "discord.js";
import { Logger } from "../Logger";

const logger = new Logger();

export const event: ReadyEvent = {
  name: "ready",
  once: true,
  execute: (client: Client) => {
    logger.info(`Logged in as ${client.user?.tag}`);
  }
};
