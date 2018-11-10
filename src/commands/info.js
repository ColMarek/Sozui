const { prefix } = require("./../config");

module.exports = {
  name: "info",
  description: "Returns info about the bot.",
  usage: "",
  execute: async message => {
    const data = [];
    data.push(
      `I am a bot that you can use to search for Anime. Use \`${prefix} help\` to see a list of commands.`
    );
    data.push("");
    data.push(`**Prefix**: ${prefix}`);
    data.push("**Developer**: ColMarek");
    data.push("**Source Code**: https://github.com/ColMarek/Sozui");

    await message.channel.send(data);
  }
};
