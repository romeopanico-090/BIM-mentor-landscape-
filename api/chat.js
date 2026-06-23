// api/chat.js — Funzione backend (serverless) per BIMentor
// La chiave API vive QUI, sul server, mai nel browser.
// Vercel esegue automaticamente i file dentro la cartella /api come funzioni serverless.

export default async function handler(req, res) {
  // Accetta solo richieste POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // La chiave viene letta dalle Environment Variables di Vercel (NON è nel codice)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key non configurata sul server" });
  }

  try {
    const { system, messages, max_tokens, model } = req.body;

    // Chiamata ad Anthropic dal server (la chiave non lascia mai il backend)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1500,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();

    // Rimanda al frontend la risposta di Anthropic così com'è
    return res.status(response.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Errore del server" });
  }
}
