const { prefix } = require("./../config");

module.exports = {
  name: "info",
  description: "Returns info about the bot.",
  usage: "",
  execute: async message => {
    const data = [];
    data.push("**Name**: Sozui");
    data.push(`**Prefix**: ${prefix}`);
    data.push("**Source Code**: https://github.com/ColMarek/Sozui");
    data.push("**Developer**: ColMarek");

    await message.channel.send(data);
  }
};
