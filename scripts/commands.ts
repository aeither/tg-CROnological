import { config } from 'dotenv';
import { Bot } from 'grammy';
import { BotCommand, UserFromGetMe } from 'grammy/types';
import Env from '../src/environment';
config({ path: '.dev.vars' });
const env = process.env as Env;

if (!env) {
	throw new Error('Environment variables are not set');
} else if (!env.BOT_TOKEN_DEV) {
	throw new Error('BOT_TOKEN_DEV environment variable is not set');
} else if (!env.BOT_TOKEN) {
	throw new Error('BOT_TOKEN environment variable is not set');
} else if (!env.BOT_INFO) {
	throw new Error('BOT_INFO environment variable is not set');
}

enum ActionType {
	Delete,
	Commands,
	Webhook,
}

const commands: BotCommand[] = [{ command: 'hi', description: 'Hi!!!' }];

const main = async () => {
	console.log('Initializing bot settings...');
	const USE_DEV = true; // set to true or false as needed
	const ACTION_TYPE: ActionType = ActionType.Commands;

	let BOT_TOKEN: string;
	let BOT_INFO: UserFromGetMe;

	BOT_TOKEN = USE_DEV ? env.BOT_TOKEN_DEV! : env.BOT_TOKEN;
	BOT_INFO = env.BOT_INFO;

	const bot = new Bot(BOT_TOKEN, { botInfo: BOT_INFO });

	if (ACTION_TYPE.toString() == ActionType.Delete.toString()) {
		const webhookSet = await bot.api.deleteWebhook();
		console.log(`Webhook successfully deleted: ${webhookSet} (Environment: ${USE_DEV ? 'Development' : 'Production'})`);
		return;
	} else if (ACTION_TYPE.toString() == ActionType.Commands.toString()) {
		const commandsSet = await bot.api.setMyCommands(commands);
		console.log(`Bot commands successfully set: ${commandsSet} (Environment: ${USE_DEV ? 'Development' : 'Production'})`);
		return;
	}

	// PROJECT_URL can't end with `/`
	const PROJECT_NAME = 'Acme Bot';
	// const PROJECT_URL = `https://1c06-37-161-191-245.ngrok-free.app`;
	const PROJECT_URL = `https://${PROJECT_NAME}.akeon.workers.dev`;
	const webhookSet = await bot.api.setWebhook(`${PROJECT_URL}/${BOT_TOKEN}`);
	console.log(`Webhook successfully set: ${webhookSet} (Environment: ${USE_DEV ? 'Development' : 'Production'})`);
};

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('An error occurred:', error);
		process.exit(1);
	});
