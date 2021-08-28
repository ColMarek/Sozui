import { config } from "../config";

export const cmd = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands"],
  usage: "<command name>",
  execute: async (message, args) => {
    const data: string[] = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("You can link anime/manga using:");
      data.push("```");
      data.push("Anime (detailed)  ->  :{anime title}:");
      data.push("Anime             ->  :{{anime title}}:");
      data.push("Manga (detailed)  ->  :<manga title>:");
      data.push("Manga             ->  :<<manga title>>:");
      data.push("```");
      data.push("React with \\📹 on a response within 5min of it being sent to post the trailer (if it has one)");
      data.push("");
      data.push("Here's a list of all my commands:");
      data.push(commands.map(command => command.name).join(", "));

      await message.channel.send(data, { split: true });

      return;
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) {
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    }
    if (command.description) {
      data.push(`**Description:** ${command.description}`);
    }
    data.push(`**Usage:** ${config.prefix} ${command.name} ${command.usage}`);

    message.channel.send(data, { split: true });
  }
};
