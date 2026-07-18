// Netlify serverless funksiyasi: forma arizasini Telegramga yuboradi.
//
// Kerakli environment o'zgaruvchilar (Netlify → Site configuration → Environment variables):
//   TG_BOT_TOKEN  — @BotFather bergan bot tokeni
//   TG_CHAT_ID    — arizalar keladigan chat id (shaxsiy yoki guruh)
//
// Endpoint: /.netlify/functions/lead  (POST, JSON: {name, phone, message})

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method Not Allowed" });
  }

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) {
    return json(500, { ok: false, error: "Server sozlanmagan (TG_BOT_TOKEN / TG_CHAT_ID yo'q)" });
  }

  let data = {};
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { ok: false, error: "Noto'g'ri so'rov" });
  }

  // Honeypot: agar "company" to'ldirilgan bo'lsa — bu bot/spam, jimgina rad etamiz.
  if (data.company) {
    return json(200, { ok: true });
  }

  const name = String(data.name || "").trim().slice(0, 200);
  const phone = String(data.phone || "").trim().slice(0, 50);
  const message = String(data.message || "").trim().slice(0, 1000);

  if (!name || !phone) {
    return json(400, { ok: false, error: "Ism va telefon majburiy" });
  }

  const text =
    "🕋 Yangi ariza — Ihlos Travel\n\n" +
    "👤 Ism: " + name + "\n" +
    "📞 Telefon: " + phone +
    (message ? "\n📝 Yo'nalish/izoh: " + message : "");

  try {
    const resp = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text, disable_web_page_preview: true }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return json(502, { ok: false, error: "Telegram xatosi", detail: detail });
    }
    return json(200, { ok: true });
  } catch (err) {
    return json(502, { ok: false, error: "Yuborishda xatolik" });
  }
};

function json(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
