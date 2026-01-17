import { Telegraf } from "telegraf";
import { config } from "dotenv";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const linkRegex = /(https?:\/\/|t\.me\/|www\.)/i;

function writeLog(message) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${message}`);
}

bot.on("message", async (ctx) => {
  try {
    const { message_id, chat, from, text, new_chat_members } = ctx.message;

    // Join message delete
    if (new_chat_members) {
      await ctx.telegram.deleteMessage(chat.id, message_id);

      writeLog(
        `JOIN_MESSAGE_DELETED | user=${from.first_name} (${from.id}) | chat=${chat.title}`
      );
      return;
    }

    // Link check
    if (text && linkRegex.test(text)) {
      const member = await ctx.telegram.getChatMember(chat.id, from.id);
      const isAdmin =
        member.status === "administrator" || member.status === "creator";

      if (!isAdmin) {
        await ctx.telegram.deleteMessage(chat.id, message_id);

        writeLog(
          `LINK_DELETED | user=${from.first_name} (${from.id}) | chat=${chat.title}`
        );
        return; // Stop processing
      }
    }

    // Explicit Word Check
    const bannedWords = ["cp", "bio", "check"];
    const hasBannedWord = bannedWords.some((word) =>
      text.toLowerCase().includes(word.toLowerCase())
    );

    if (text && hasBannedWord) {
      const member = await ctx.telegram.getChatMember(chat.id, from.id);
      const isAdmin =
        member.status === "administrator" || member.status === "creator";

      if (!isAdmin) {
        await ctx.telegram.deleteMessage(chat.id, message_id);

        writeLog(
          `EXPLICIT_DELETED | user=${from.first_name} (${from.id}) | chat=${chat.title}`
        );
        return;
      }
    }
  } catch (error) {
    writeLog(`ERROR | ${error.message}`);
    console.error("Error:", error.message);
  }
});

export default bot;
