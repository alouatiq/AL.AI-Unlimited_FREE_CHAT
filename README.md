# AL-AI

A serverless AI chat app that runs on **free AI providers**, with:

- 🔌 **Multiple providers** — OpenRouter, Groq, Google Gemini, Cerebras (all OpenAI-compatible)
- ♻️ **Two-level fallback** — walks your provider order, and within each provider walks its model list, until one answers
- 🎚 **Model picker** — pick & **drag-to-reorder** (▲▼ on mobile) each provider's models from a live/searchable list; add any custom id
- 🖥 **On-device AI (WebLLM)** — download a model that runs fully in your browser via WebGPU: no key, no limits, works offline. Shows **install status** (Installed ✓ / Download / Remove). Small models run on phones.
- 🎨 **Images** — a 🎨 button generates images (**Pollinations · FLUX**, free & keyless) or, when you attach a photo, edits/improves it (**Nano Banana** = `gemini-2.5-flash-image`, free Google key).
- 📎 **Attachments** — 📎 / drag-drop / paste images, PDFs and text files into chat (vision models read images; text is inlined).
- 🔀 **Normal / Uncensored toggle** — uncensored mode prioritises on-device (Hermes/Mistral) + uncensored cloud models
- 🔄 **Self-healing OpenRouter list** — pulls the *live* free-model list so names never go stale
- 💾 **History in the browser only** (localStorage) — nothing is stored on a server
- 🔐 **Keys stay secret** — server keys in Vercel env vars (proxied by an Edge function), or paste your own per provider (browser-only)

**Key priority per provider: server env key → your pasted key → skip.** Deploy with whatever env keys you have and users need nothing; anyone can also add their own key for providers you leave unset; On-device needs no key at all.

## How it works

| File | Role |
|------|------|
| `index.html` | The entire frontend (self-contained, no build step) |
| `api/chat.js` | Edge function — proxies chat to the chosen provider using its **server-side** key |
| `api/models.js` | Edge function — returns the live free-model list + which providers have a server key |

The frontend auto-detects its environment:

- **Deployed on Vercel** → `/api/chat` is reachable → uses the server key. Nothing to paste.
- **Opened locally** (`file://` or a plain static server) → no functions → you paste your own key in ⚙ Settings (stored only in your browser).

## Deploy to Vercel

1. Get a free key at <https://openrouter.ai/keys>.
2. Push this folder to a Git repo (GitHub/GitLab), or run `vercel` from the Vercel CLI.
3. In **Vercel → Project → Settings → Environment Variables**, add:

   ```
   OPENROUTER_API_KEY = sk-or-v1-...
   ```

4. Deploy. That's it — no framework, Vercel serves `index.html` statically and runs `api/*` as Edge functions.

### CLI one-liner

```bash
npm i -g vercel
vercel            # first deploy (answer the prompts)
vercel env add OPENROUTER_API_KEY   # paste the key, choose all environments
vercel --prod     # promote to production
```

## Run locally

```bash
# Static (you'll paste your key in Settings):
npx serve .

# OR with the functions working locally (reads .env.local):
cp .env.example .env.local   # then edit it
vercel dev
```

## Groups (projects)

Chats are organised under **groups**. Each group holds a **system prompt / instructions** that every chat inside it inherits — like ChatGPT Projects.

- **+ Group** to create one; **✎** (or the 📁 button in the top bar) to edit its name & instructions.
- Example: a *"Python tutor"* group with *"You are a senior Python dev, be concise, show code"* — every chat you start in it behaves that way.
- Instructions are sent as the `system` message to every provider, cloud and on-device.

## On-device AI (no limits, no key)

⚙ Settings → the **On-device (WebLLM)** provider runs a model fully in your browser via **WebGPU** — no key, no rate limits, works offline. It's just another entry in the fallback chain:

- **Drag it to the top** → on-device is used first (fully offline/private).
- **Leave it at the bottom** → used only when every cloud provider fails/rate-limits.
- **Untick it** → disabled.

The model list is WebLLM's **live catalogue** with **size**, **install status** (Installed ✓ / Download / Remove), and filters for **size**, **phone-safe** (≲1.7 GB) and **uncensored**. The first run downloads the chosen model once, then it's cached. Small models (0.5–1 B) run on phones; the genuinely uncensored ones (Hermes/Mistral) are ~2–5 GB and need a laptop/desktop.

## Notes

- Free models rate-limit and change often — that's exactly why the two-level fallback exists. Pick & reorder each provider's models in ⚙ Settings.
- "Uncensored" models just refuse less; they're still bound by each provider's limits and the law where you are. Use responsibly.
