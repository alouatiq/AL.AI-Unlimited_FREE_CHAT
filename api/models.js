// Vercel Edge Function — returns:
//   models:    the live list of free OpenRouter model IDs (self-healing fallback list)
//   providers: which providers have a server-side key configured (booleans only,
//              never the keys themselves) so the frontend knows what it can use.
export const config = { runtime: "edge" };

export default async function handler() {
  const providers = {
    openrouter: !!process.env.OPENROUTER_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    google: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    cerebras: !!process.env.CEREBRAS_API_KEY,
    huggingface: !!process.env.HF_TOKEN,
  };

  let models = [];
  try {
    const r = await fetch("https://openrouter.ai/api/v1/models");
    const j = await r.json();
    models = (j.data || [])
      .filter((m) => typeof m.id === "string" && m.id.endsWith(":free"))
      .map((m) => m.id);
  } catch (e) { /* leave models empty; frontend has static fallbacks */ }

  return new Response(JSON.stringify({ models, providers }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
