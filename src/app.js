const fs = require("fs");
const winston = require("winston");
const Discord = require("discord.js");

const { botToken } = require("./config");
const discordUtils = require("./utils/discord");
const { generateMessageEmbed } = require("./utils/anime");
const animeSearch = require("./core/animeSearch");

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
client.commands = new Discord.Collection();

// Load command files
const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".js"));
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
  // Check if the message is valid
  if (!discordUtils.isValidMessage(message)) {
    return;
  }

  winston.info(
    `${message.guild ? message.guild.name + " -> " : ""}` +
      `${message.author.username}#${message.author.discriminator} -> ` +
      message.content
  );

  // Handle :{{anime title}}:
  const foundExtended = message.content.match(discordUtils.animeExtendedRegex);
  if (foundExtended) {
    await handleBracketsSearch(foundExtended, message, true);
    return;
  }
  // Handle :{anime title}:
  const found = message.content.match(discordUtils.animeRegex);
  if (found) {
    await handleBracketsSearch(found, message, false);
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

async function handleBracketsSearch(found, message, extended) {
  // Repeat for as many strings found
  found.forEach(async query => {
    // Remove brackets
    if (extended) {
      query = query.replace(":{{", "");
      query = query.replace("}}:", "");
    } else {
      query = query.replace(":{", "");
      query = query.replace("}:", "");
    }
    query = query.trim();

    if (query === "") {
      return;
    }

    const anime = await animeSearch(query);
    if (!anime) {
      message.channel.send(`I was unable to find any anime called *${query}*`);
      return;
    }

    const embed = generateMessageEmbed(anime, extended);

    message.channel.startTyping();
    await message.channel.send(embed);
    await message.react("✅");
    message.channel.stopTyping(true);
    winston.debug(`Sent reply for '${query}'`);
  });
}

client.login(botToken);
