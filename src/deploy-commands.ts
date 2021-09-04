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

interface StaleCommand {
  guild: string;
  commandId: string;
  commandName: string;
}

const logger = new Logger();

const rest = new REST({ version: "9" }).setToken(config.botToken);

export async function setupCommands() {
  await deployCommands();

  const localCommands = getLocalCommands().map(c => c.name);
  const deployedCommands = (await getDeployedCommands())
    .map(c => ({ guild:c.guild, commands: c.commands.map(c2 => ({ id:c2.id, name:c2.name, }) ) }));

  const staleCommands: StaleCommand[] = [];
  for (const buildCommand of deployedCommands) {
    for (const command of buildCommand.commands) {
      if (localCommands.indexOf(command.name) === -1) {
        staleCommands.push({ guild:buildCommand.guild, commandId: command.id, commandName: command.name });
      }
    }
  }

  logger.debug(`Found ${staleCommands.length} stale commands across ${deployedCommands.length} guilds`);
  await deleteCommand(staleCommands);
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

    logger.debug("Successfully registered application commands.");
  } catch (error) {
    logger.error(error.message);
  }
}

async function deleteCommand(staleCommands: StaleCommand[]) {
  const delP = staleCommands.map(c => {
    logger.debug(`Deleting command ${c.commandName} from ${c.guild}`);
    return rest.delete(
      Routes.applicationGuildCommand(config.applicationId, c.guild, c.commandId)
    );
  });

  await Promise.all(delP);
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
