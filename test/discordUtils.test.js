const assert = require("chai").assert;
const { prefix } = require("./../src/config/index");
const discordUtils = require("./../src/utils/discord");

describe("discord utils test", () => {
  describe("validate message", () => {
    it("should fail if author is bot", () => {
      const message = generateMessage("title", true, "text");

      const actual = discordUtils.isValidMessage(message);
      assert.strictEqual(actual, false);
    });

    it("should succeed if has no prefix but is a dm", () => {
      const message = generateMessage("title", false, "dm");

      const actual = discordUtils.isValidMessage(message);
      assert.strictEqual(actual, true);
    });

    it("should fail if message has no prefix", () => {
      const message = generateMessage("title", false, "text");

      const actual = discordUtils.isValidMessage(message);
      assert.strictEqual(actual, false);
    });

    it("should succeed if message has prefix", () => {
      const message = generateMessage(`${prefix} anime title`, false, "text");

      const actual = discordUtils.isValidMessage(message);
      assert.strictEqual(actual, true);
    });

    it("should succed if message has brackets", () => {
      // const message = generateMessage(":{}:", false, "text");
      const message = generateMessage(":{title}:", false, "text");

      const actual = discordUtils.isValidMessage(message);
      assert.strictEqual(actual, true);
    });
  });

  describe("extract args", () => {
    it("should extract args from dm message", () => {
      const message = generateMessage("help  anime", false, "dm");

      const actual = discordUtils.extractArgs(message);
      assert.deepEqual(actual, ["help", "anime"]);
    });

    it("should extract args from message", () => {
      const message = generateMessage(`${prefix} help  anime`, false, "dm");

      const actual = discordUtils.extractArgs(message);
      assert.deepEqual(actual, ["help", "anime"]);
    });
  });

  describe("regex", () => {
    it("should match message with brackets", () => {
      const actual = ":{anime 1}: and :{anime 2}:".match(discordUtils.animeRegex);
      assert.deepEqual(actual, [":{anime 1}:", ":{anime 2}:"]);
    });
    it("should match message with double brackets", () => {
      const actual = ":{{anime 1}}: and :{{anime 2}}:".match(discordUtils.animeExtendedRegex);
      assert.deepEqual(actual, [":{{anime 1}}:", ":{{anime 2}}:"]);
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
