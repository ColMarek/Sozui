import * as fs from "fs";
import * as path from "path";
import { config } from "./config";
import { Client, Collection, Intents } from "discord.js";
import { initializeLogger, Logger } from "./utils/Logger";
import { EventHandler } from "./models/EventHandler";
import { CommandHandler } from "./models/CommandHandler";
import { setupCommands } from "./deploy-commands";

initializeLogger();
const logger = new Logger();
const commands: Collection<string, CommandHandler> = new Collection();

async function main() {
  const client: Client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
  });

  if (config.env === "production") {
    await setupCommands();
  }
  loadCommands();
  loadEvents(client);

  await client.login(config.botToken);
}

function loadCommands() {
  const commandsDir = path.resolve(path.join(__dirname, "discord/commands"));
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const command: CommandHandler = require(path.join(commandsDir, file)).cmd;
    if (command === undefined) {
      logger.error(`Command file ${file} does not export 'cmd' const`);
      process.exit(1);
    }

    commands.set(command.name, command);
  }

  const commandNames = commands.map((c, k) => (k));
  logger.debug(`Loaded commands [${commandNames.join(",")}]`, "loadCommands");
}

function loadEvents(client: Client) {
  const eventsDir = path.resolve(path.join(__dirname, "discord/events"));
  const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith(".ts"));

  if (commands.size == 0) {
    logger.warn("No commands loaded");
  }

  const eventNames: string[] = [];
  for (const file of eventFiles) {
    const event: EventHandler = require(path.join(eventsDir, file)).event;
    if (event === undefined) {
      logger.error(`Event file ${file} does not export 'event' const`);
      process.exit(1);
    }
    eventNames.push(event.name);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, commands, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, commands, ...args));
    }
  }

  logger.debug(`Loaded events [${eventNames.join(",")}]`, "loadEvents");
}

main().catch(e => logger.error(e.message));
