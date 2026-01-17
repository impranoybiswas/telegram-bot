import bot from "../bot.js";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    await bot.telegram.setWebhook(url);
    res.status(200).json({ message: `Webhook set to ${url}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
