module.exports = {
  name: "ping",
  description: "Test if the bot can respond",
  execute: async message => {
    await message.channel.send("Pong");
  }
};
