# Contributing to AL.AI

Thanks for your interest — contributions are very welcome! 🎉

AL.AI is intentionally **simple**: one self-contained `index.html` plus a handful of
Vercel Edge functions in `api/`. No build step, no framework, no dependencies to install.

## Ways to contribute

- 🐛 **Report a bug** — open an [issue](../../issues) with steps to reproduce.
- 💡 **Suggest a feature** — open an issue describing the idea and the use case.
- 🔌 **Add a provider** — any OpenAI-compatible endpoint is easy to slot in (`PROVIDERS` in `index.html` + `api/chat.js`).
- 🎨 **Improve the UI / docs / accessibility.**
- 🌍 **Translations.**

## Dev setup

```bash
git clone https://github.com/alouatiq/AL.AI-Unlimited_FREE_CHAT.git
cd AL.AI-Unlimited_FREE_CHAT

# Option A — static (paste your own key in ⚙ Settings):
npx serve .

# Option B — with the serverless functions (reads .env.local):
cp .env.example .env.local   # add at least OPENROUTER_API_KEY
npx vercel dev
```

There is **no build**. Edit `index.html` / `api/*.js` and refresh.

## Guidelines

- Keep it **dependency-free and self-contained** — the whole app must run from a single HTML file plus stateless Edge functions.
- Match the existing code style (vanilla JS, small helpers, no framework).
- Test in a browser before opening a PR (chat, fallback, settings, on-device if you have WebGPU).
- Never commit secrets — `.env` is git-ignored.

## Pull requests

1. Fork → create a branch (`feat/my-thing`).
2. Make focused changes with a clear description.
3. Open a PR against `master`. Screenshots/GIFs for UI changes are appreciated.

By contributing you agree your work is licensed under the project's [MIT License](LICENSE).
