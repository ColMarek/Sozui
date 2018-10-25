const winston = require("winston");

const { prefix } = require("./config");

module.exports = {
  discord: {
    /**
     * Checks that a message is in the valid format for
     * @param {*} message Discord.js message
     */
    isValidMessage(message) {
      if (message.author.bot) {
        return false;
      } else if (
        !message.content.startsWith(prefix) &&
        message.channel.type === "dm"
      ) {
        return true;
      } else if (!message.content.startsWith(prefix)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * Extract arguments from a message
     * @param {*} message Discord.js message
     */
    extractArgs(message) {
      // Extract args from message by splitting at spaces
      let args;
      // DMs don't need a prefix
      if (
        !message.content.startsWith(prefix) &&
        message.channel.type === "dm"
      ) {
        args = message.content.split(/ +/);
      } else {
        args = message.content
          .slice(prefix.length)
          .trim()
          .split(/ +/);
      }

      return args;
    },
    /**
     * Check that a command is valid by checking that it exists and it has arguments, if they
     * are required.
     * @param {String[]} args List of arguments. Obtained from Utils.discord.extractArgs
     * @param {*} client Discord.js client
     * @param {*} message Discord.js message
     */
    validateCommand(args, client, message) {
      // Use the first arg command name
      const commandName = args.shift().toLowerCase();

      // Find command for the name
      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );

      // Check if command exists
      if (!command) {
        winston.warn(`Unable to find command for '${commandName}'`);
        const data = [];
        data.push(
          `${message.author} I could not find any command like '${commandName}'`
        );
        data.push(`Did you mean \`${prefix} anime ${commandName}\``);
        message.channel.send(data);
        return;
      }

      // Check if the command requires args
      if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
          reply += `\nThe proper usage would be: \`${prefix} ${command.name} ${
            command.usage
          }\``;
        }

        message.channel.send(reply);
        return;
      }

      return command;
    }
  }
};
