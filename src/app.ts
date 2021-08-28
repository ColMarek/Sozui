import * as fs from "fs"
import * as winston from "winston"
import * as Discord from "discord.js"
import {config} from "./config"
import * as discordUtils from "./utils/discord"
import * as core from "./core"

if (!fs.existsSync(__dirname + "/../logs")) {
  fs.mkdirSync(__dirname + "/../logs");
}

// Initialize logger
const { combine, timestamp, printf } = winston.format;
const customFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);
winston.configure({
  level: "debug",
  format: combine(timestamp(), customFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: __dirname + "/../logs/combined.log",
      format: combine(timestamp(), customFormat)
    })
  ]
});

const client = new Discord.Client();
// @ts-ignore
client.commands = new Discord.Collection();

// Load command files
const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".ts"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`).cmd;
  // @ts-ignore
  client.commands.set(command.name, command);
}

/**
 * Bot is initialized
 */
client.on("ready", () => {
  // @ts-ignore
  winston.info(`Logged in as ${client.user.tag}!`);
});

/**
 * Handle messages
 */
client.on("message", async message => {
  // Check if the message is valid
  if (!discordUtils.isValidMessage(message)) {
    return;
  }

  winston.info(
    `${message.guild ? message.guild.name + " -> " : ""}` +
      `${message.author.username}#${message.author.discriminator} -> ` +
      message.content
  );

  const handled = await core.checkAndHandleBracketsSearch(message);
  if (handled) {
    return;
  }

  // Handle a messages that uses the prefix
  const args = discordUtils.extractArgs(message);
  const command = discordUtils.validateCommand(args, client, message);
  // If the command is valid
  if (command) {
    try {
      message.channel.startTyping();
      await command.execute(message, args);
      await message.react("✅");
      message.channel.stopTyping(true);
    } catch (error) {
      message.channel.stopTyping();
      winston.error(error);
      message.reply("There was an error trying to execute that command!");
    }
  }
});

client.login(config.botToken);
