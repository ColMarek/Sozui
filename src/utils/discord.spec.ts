import { Message } from "discord.js";
import { isValidMessage } from "./discord";

describe("discord utils test", () => {
  describe("validate message", () => {
    it("should fail if author is bot", () => {
      const message = generateMessage("title", true, "text");

      const actual = isValidMessage(message as Message);
      expect(actual).toBe(false);
    });

    it("should succeed if message has anime brackets", () => {
      const message = generateMessage(":{title}:", false, "text");

      const actual = isValidMessage(message as Message);
      expect(actual).toBe(true);
    });

    it("should succeed if message has anime extended brackets", () => {
      const message = generateMessage(":{{title}}:", false, "text");

      const actual = isValidMessage(message as Message);
      expect(actual).toBe(true);
    });

    it("should succeed if message has manga brackets", () => {
      const message = generateMessage(":<title>:", false, "text");

      const actual = isValidMessage(message as Message);
      expect(actual).toBe(true);
    });

    it("should succeed if message has manga extended brackets", () => {
      const message = generateMessage(":<<title>>:", false, "text");

      const actual = isValidMessage(message as Message);
      expect(actual).toBe(true);
    });
  });
});

function generateMessage(content, authorBot, channelType) {
  return {
    content,
    author: {
      bot: authorBot
    },
    channel: {
      type: channelType
    }
  };
}
