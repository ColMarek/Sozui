import { Client, Collection, CommandInteraction, Message } from "discord.js";
import { CommandHandler } from "./CommandHandler";

export interface EventHandler {
  name: string;
  once: boolean;
  execute: (client: Client, commands: Collection<string, CommandHandler>, ...args) => void;
}

export interface ReadyEvent extends EventHandler {
  execute: (client: Client) => void;
}

export interface MessageCreateEvent extends EventHandler {
  execute: (client: Client, commands: Collection<string, CommandHandler>, message: Message) => void;
}

export interface InteractionCreate extends EventHandler {
  execute: (client: Client, commands: Collection<string, CommandHandler>, interaction: CommandInteraction) => void;
}
