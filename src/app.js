const fs = require("fs");
const winston = require("winston");
const Discord = require("discord.js");

const { botToken, prefix } = require("./config");
const discordUtils = require("./utils/discord");
const { generateMiniMessageEmbed } = require("./utils/anime");
const animeSearch = require("./core/animeSearch");

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
  // Handle a message that searches using brackets e.g. {anime title}
  if (!message.content.includes(prefix)) {
    const found = message.content.match(/\{(.*?)\}/g);
    if (found) {
      winston.info(
        `${message.guild ? message.guild.name + " -> " : ""}${
          message.author.username
        }#${message.author.discriminator}-> ${message.content}`
      );
      await handleBracketsSearch(found, message);
      return;
    }
    // return;
  }

  if (!discordUtils.isValidMessage(message)) {
    return;
  }

  winston.info(
    `${message.guild ? message.guild.name + " -> " : ""}${
      message.author.username
    }#${message.author.discriminator}-> ${message.content}`
  );
  const args = discordUtils.extractArgs(message);

  const command = discordUtils.validateCommand(args, client, message);
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

async function handleBracketsSearch(found, message) {
  found.forEach(async query => {
    query = query.replace("{", "");
    query = query.replace("}", "");

    const anime = await animeSearch(query);
    if (!anime) {
      message.channel.send(`I was unable to find any anime called *${query}*`);
    }

    const embed = generateMiniMessageEmbed(anime);

    await message.channel.send(anime.title, {
      embed
    });
    winston.debug(`Sent reply for '${query}'`);
  });
}

client.login(botToken);
