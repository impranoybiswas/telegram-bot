import fs from "fs";
import path from "path";
import { Telegraf } from "telegraf";
import { config } from "dotenv";

config();

// Ensure logs directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFilePath = path.join(logDir, "bot.log");

function writeLog(message) {
  const time = new Date().toISOString();
  const logLine = `[${time}] ${message}\n`;

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) console.error("Log write failed:", err.message);
  });
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const linkRegex = /(https?:\/\/|t\.me\/|www\.)/i;

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
      }
    }
  } catch (error) {
    writeLog(`ERROR | ${error.message}`);
    console.log("Error:", error.message);
  }
});

bot.launch();
console.log("✅ Bot running successfully");
