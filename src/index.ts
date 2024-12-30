import Env from './environment.d';
import { webhookCallback } from 'grammy';
import { initBot } from './bot';
/**
 * ===
 * Development Using Webhook Steps:
 *     1. npm run start
 *     2. Port forwarding inv VS Code
 *     3. Set Webhook
 *     4. Test the bot
 * ===
 * Production Steps:
 *     1. Enable routing in Cloudflare Workers
 *     2. npm run deploy
 *     3. Set Webhook to the deployed URL
 *     4. Test the bot
 * ===
 * setWebhook
 * To set webhook: https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<MY_BOT>.<MY_SUBDOMAIN>.workers.dev/
 * To delete webhook: https://api.telegram.org/bot<BOT_TOKEN>/deleteWebhook?drop_pending_updates=true
 * ===
 */

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		try {
			const bot = initBot(env);
			const cb = webhookCallback(bot, 'cloudflare-mod');
			return await cb(req);
		} catch (e: any) {
			return new Response(e.message, { status: 500 });
		}
	},
};
