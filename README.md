# Telegram Bot Starter Template With Cloudflare Workers Hosting

Tech Stack: Bun + Grammy + Typescript

# Resources

- [Grammy - Hosting: Cloudflare Workers (Node.js)](https://grammy.dev/hosting/cloudflare-workers-nodejs)
- [Cloudflare Environment Variables](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [Cloudflare Secrets Variables](https://developers.cloudflare.com/workers/configuration/secrets/)

# Initiation Setup

1. Follow [Grammy - Hosting: Cloudflare Workers (Node.js)](https://grammy.dev/hosting/cloudflare-workers-nodejs) to setup

- Update `package.json`

- Update `wrangler.toml`

2. Setup `dev.vars`

```bash
cp .dev.vars.example .dev.vars
```

# Development Setup (Local - Long Polling)

- `bun run dev`

# Deployment Setup

0. Run the command line `bun run secret`.

1. Run the command line `bun run ship`.

2. Set webhook to deployed URL by accessing `https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<MY_BOT>.<MY_SUBDOMAIN>.workers.dev/` from your browser or configure `scripts/commands.ts` and run `bun run cmd`
3. Test by sending message to Bot.

---

**Good Luck!**
