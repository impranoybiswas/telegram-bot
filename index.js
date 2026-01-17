import bot from "./bot.js";

bot.launch().then(() => {
    console.log("✅ Bot running successfully in polling mode");
}).catch(err => {
    console.error("Failed to launch bot:", err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
