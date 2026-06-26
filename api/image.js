// Vercel Edge Function — proxies Google Gemini image generation/editing
// ("Nano Banana" = gemini-2.5-flash-image) using the server Google key.
// Body: the full generateContent payload plus { model }. Used only when the
// visitor has NOT supplied their own Google key.
export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: { message: "POST only" } }, 405);

  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) return json({ error: { message: "No server Google key (set GEMINI_API_KEY), or add your own in Settings." } }, 400);

  let body;
  try { body = await req.json(); } catch { return json({ error: { message: "Invalid JSON" } }, 400); }

  const model = body.model || "gemini-2.5-flash-image";
  const { model: _m, ...payload } = body;

  let r;
  try {
    r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );
  } catch (e) {
    return json({ error: { message: "Upstream fetch failed: " + e.message } }, 502);
  }

  return new Response(r.body, {
    status: r.status,
    headers: { "Content-Type": r.headers.get("content-type") || "application/json" },
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
