const { prefix } = require("./../config");

export const cmd = {
  name: "info",
  description: "Returns info about the bot.",
  usage: "",
  execute: async message => {
    const data: string[] = [];
    data.push(`I am a bot that you can use to link anime and manga. Use \`${prefix} help\`.`);
    data.push("**Developer**: ColMarek");
    data.push("**Source Code**: https://github.com/ColMarek/Sozui");

    await message.channel.send(data);
  }
};
