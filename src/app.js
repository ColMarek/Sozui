const fs = require("fs");
const winston = require("winston");
const Discord = require("discord.js");

const { botToken } = require("./config");
const utils = require("./utils");

// Initialize logger
const { combine, timestamp, printf } = winston.format;
const customFormat = printf(
  info => `${info.timestamp} ${info.level}: ${info.message}`
);
winston.configure({
  level: "debug",
  format: combine(timestamp(), customFormat),
  transports: [new winston.transports.Console()]
});

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Load command files
const commandFiles = fs
  .readdirSync(__dirname + "/commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/**
 * Bot is initialized
 */
client.on("ready", () => {
  winston.info(`Logged in as ${client.user.tag}!`);
});

/**
 * Handle messages
 */
client.on("message", async message => {
  if (!utils.discord.isValidMessage(message)) {
    return;
  }

  winston.info(
    `${message.guild ? message.guild.name + " -> " : ""}${
      message.author.username
    }#${message.author.discriminator}-> ${message.content}`
  );
  const args = utils.discord.extractArgs(message);

  const command = utils.discord.validateCommand(args, client, message);
  // There was a problem with the command
  if (!command) {
    return;
  }

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
});

client.login(botToken);
