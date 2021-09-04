import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  botToken: process.env.DISCORD_BOT_TOKEN || "",
  applicationId: process.env.APPLICATION_ID || "",
  guildIds: process.env.GUILD_IDS || "",
};
