// api/stats.js — Mini-dashboard per leggere i dati raccolti.
// Protetta da un token segreto: si apre con  /api/stats?key=IL_TUO_TOKEN
// Imposta la variabile d'ambiente STATS_TOKEN su Vercel con un valore a tua scelta.

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
  // Protezione: serve il token giusto
  const token = process.env.STATS_TOKEN || "changeme";
  if ((req.query.key || "") !== token) {
    return res.status(401).send("Non autorizzato");
  }

  try {
    const redis = await getClient();

    // Prende tutte le chiavi dei contatori
    const keys = await redis.keys("count:*");
    const data = {};
    for (const k of keys) {
      data[k] = parseInt(await redis.get(k) || "0", 10);
    }

    // Ultimi eventi grezzi
    const recentRaw = await redis.lRange("events:recent", 0, 49);
    const recent = recentRaw.map((r) => { try { return JSON.parse(r); } catch { return null; } }).filter(Boolean);

    // Organizza i dati per la visualizzazione
    const byEvent = {}, byLang = {}, byLessonFund = {}, byLessonLand = {}, byQuestion = {}, byDay = {};
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith("count:event:")) byEvent[k.replace("count:event:", "")] = v;
      else if (k.startsWith("count:lang:")) byLang[k.replace("count:lang:", "")] = v;
      else if (k.startsWith("count:lesson:fundamentals:")) byLessonFund[k.replace("count:lesson:fundamentals:", "")] = v;
      else if (k.startsWith("count:lesson:landscape:")) byLessonLand[k.replace("count:lesson:landscape:", "")] = v;
      else if (k.startsWith("count:questions:")) byQuestion[k.replace("count:questions:", "")] = v;
      else if (k.startsWith("count:daily:")) byDay[k.replace("count:daily:", "")] = v;
    }

    const table = (obj, label) => {
      const rows = Object.entries(obj).sort((a, b) => b[1] - a[1]);
      if (!rows.length) return `<p style="color:#888">Nessun dato per ${label}</p>`;
      return `<table>${rows.map(([k, v]) => `<tr><td>${k}</td><td><b>${v}</b></td></tr>`).join("")}</table>`;
    };

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BIMentor · Statistiche</title>
<style>
  body{font-family:system-ui,sans-serif;background:#f4f6fb;color:#1a1d28;max-width:900px;margin:0 auto;padding:24px;line-height:1.5}
  h1{font-size:24px} h2{font-size:16px;margin-top:28px;color:#3d7ef5;border-bottom:1px solid #dfe4ee;padding-bottom:6px}
  table{border-collapse:collapse;width:100%;margin:8px 0;background:#fff;border-radius:8px;overflow:hidden}
  td{padding:8px 12px;border-bottom:1px solid #eef1f7;font-size:14px}
  td:last-child{text-align:right;width:80px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .card{background:#fff;border:1px solid #dfe4ee;border-radius:10px;padding:16px}
  small{color:#888}
</style></head><body>
<h1>📊 BIMentor · Statistiche d'uso</h1>
<small>Aggiornato: ${new Date().toLocaleString("it-IT")}</small>

<h2>Eventi totali</h2>
${table(byEvent, "eventi")}

<h2>Lingua (IT vs EN)</h2>
${table(byLang, "lingua")}

<div class="grid">
  <div><h2>Lezioni aperte · Fundamentals</h2>${table(byLessonFund, "lezioni fundamentals")}</div>
  <div><h2>Lezioni aperte · Landscape</h2>${table(byLessonLand, "lezioni landscape")}</div>
</div>

<h2>Domande al tutor per lezione</h2>
${table(byQuestion, "domande")}

<h2>Attività giornaliera</h2>
${table(byDay, "giorni")}

<h2>Ultimi 50 eventi</h2>
<table>${recent.map(e => `<tr><td>${new Date(e.t).toLocaleString("it-IT")}</td><td>${e.event} · ${e.app || ""} ${e.lessonTitle ? "· " + e.lessonTitle : ""} ${e.lang ? "· " + e.lang : ""}</td></tr>`).join("")}</table>

</body></html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (e) {
    return res.status(500).send("Errore: " + e.message);
  }
}
