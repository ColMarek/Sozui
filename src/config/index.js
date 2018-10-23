require("dotenv").config();

module.exports = {
  botToken: process.env.DISCORD_BOT_TOKEN || "",
  prefix: process.env.DISCORD_BOT_PREFIX || "!sozui"
};
