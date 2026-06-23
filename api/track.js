// api/track.js — Riceve eventi di utilizzo e li salva in Redis (Vercel Storage)
// Privacy-friendly: nessun dato personale, solo metadati anonimi su come si usa l'app.

import { createClient } from "redis";

let client = null;
async function getClient() {
  if (client && client.isOpen) return client;
  client = createClient({ url: process.env.STORAGE_REDIS_URL });
  client.on("error", () => {});
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event, app, lesson, lessonTitle, lang, extra } = req.body || {};
    if (!event) return res.status(400).json({ error: "Missing event" });

    const redis = await getClient();
    const day = new Date().toISOString().slice(0, 10); // es. 2026-06-23

    // Contatori aggregati (semplici da leggere, occupano pochissimo spazio)
    const inc = (key) => redis.incr(key);

    await inc(`count:event:${event}`);                       // totale per tipo evento
    if (app) await inc(`count:app:${app}:${event}`);          // per app
    if (lang) await inc(`count:lang:${lang}`);                // IT vs EN
    if (event === "lesson_open" && lesson != null) {
      await inc(`count:lesson:${app || "?"}:${lesson}`);      // quale lezione aperta
    }
    if (event === "message_sent" && lesson != null) {
      await inc(`count:questions:${app || "?"}:${lesson}`);   // domande per lezione
    }
    await inc(`count:daily:${day}`);                          // attività giornaliera totale

    // Tiene anche una lista recente di eventi grezzi (ultimi 500) per ispezione
    const entry = JSON.stringify({ t: Date.now(), event, app, lesson, lessonTitle, lang, extra });
    await redis.lPush("events:recent", entry);
    await redis.lTrim("events:recent", 0, 499);

    return res.status(200).json({ ok: true });
  } catch (e) {
    // Il tracking non deve mai rompere l'esperienza utente: fallisce in silenzio
    return res.status(200).json({ ok: false });
  }
}
