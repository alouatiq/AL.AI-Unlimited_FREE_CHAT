// Vercel Edge Function — proxies Hugging Face Inference (image models) to avoid
// browser CORS and keep a server token optional. Body: { model, payload, token? }.
// Uses the caller's token if provided, else the server HF_TOKEN. Returns the raw
// image bytes (or the JSON error) straight through.
export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let b;
  try { b = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const model = b.model;
  if (!model) return json({ error: "model required" }, 400);

  const token = b.token || process.env.HF_TOKEN;
  if (!token) return json({ error: "No Hugging Face token (add yours in Settings or set HF_TOKEN)." }, 400);

  let r;
  try {
    r = await fetch("https://api-inference.huggingface.co/models/" + model, {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(b.payload || {}),
    });
  } catch (e) {
    return json({ error: "Upstream fetch failed: " + e.message }, 502);
  }

  return new Response(r.body, {
    status: r.status,
    headers: { "Content-Type": r.headers.get("content-type") || "application/octet-stream" },
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
