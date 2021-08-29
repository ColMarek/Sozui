import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes, RESTGetAPIApplicationGuildCommandsResult } from "discord-api-types/v9";
import * as fs from "fs";
import { config } from "./config";
import * as path from "path";
import { CommandHandler } from "./models/CommandHandler";
import { Logger } from "./Logger";

interface CommandJson {
  name: string;
  description: string;
  options: APIApplicationCommandOption[];
  default_permission: boolean | undefined;
}

interface DeployedCommands {
  guild: string;
  commands: RESTGetAPIApplicationGuildCommandsResult;
}

const logger = new Logger();

const rest = new REST({ version: "9" }).setToken(config.botToken);

export async function setupCommands() {
  await deployCommands();
  // const localCommands = getLocalCommands();
  // const deployedCommands = await getDeployedCommands();

  // TODO Delete stale commands
}

export async function deployCommands() {
  const commands = getLocalCommands();

  try {
    const guilds = config.guildIds.split(",");
    for (const guild of guilds) {
      await rest.put(
        Routes.applicationGuildCommands(config.applicationId, guild),
        { body: commands },
      );
    }

    logger.info("Successfully registered application commands.");
  } catch (error) {
    logger.error(error.message);
  }
}

function getLocalCommands(): CommandJson[] {
  const commands: CommandJson[] = [];
  const commandsDir = path.resolve(path.join(__dirname, "commands"));
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const command: CommandHandler = require(path.join(commandsDir, file)).cmd;
    commands.push(command.data.toJSON());
  }

  return commands;
}

async function getDeployedCommands(): Promise<DeployedCommands[]> {
  const guilds = config.guildIds.split(",");
  const deployedCommands: DeployedCommands[] = [];
  for (const guild of guilds) {
    const res = await rest.get(Routes.applicationGuildCommands(config.applicationId, guild));
    deployedCommands.push({
      guild,
      commands: res as RESTGetAPIApplicationGuildCommandsResult
    });
  }

  return deployedCommands;
}
