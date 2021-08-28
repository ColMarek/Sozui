import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  botToken: process.env.DISCORD_BOT_TOKEN || "",
  prefix: process.env.DISCORD_BOT_PREFIX || "!sozui"
};
