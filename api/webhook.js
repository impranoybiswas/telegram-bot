import bot from "../bot.js";

export default async function handler(request, response) {
  try {
      if (request.method === 'POST') {
          await bot.handleUpdate(request.body);
          response.status(200).json({ ok: true });
      } else {
          response.status(200).json({ message: "Bot is active! Send a POST request to this URL for updates." });
      }
  } catch (e) {
      console.error("Webhook error:", e);
      response.status(500).json({ error: e.message });
  }
}
