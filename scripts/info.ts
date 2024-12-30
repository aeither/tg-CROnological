import { config } from 'dotenv';
import { Bot } from 'grammy';
import { UserFromGetMe } from 'grammy/types';
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

const main = async () => {
	console.log('Initializing bot settings...');
	const USE_DEV = true; // set to true or false as needed

	let BOT_TOKEN: string;
	let BOT_INFO: UserFromGetMe;

	BOT_TOKEN = USE_DEV ? env.BOT_TOKEN_DEV! : env.BOT_TOKEN;
	BOT_INFO = env.BOT_INFO;

	const bot = new Bot(BOT_TOKEN, { botInfo: BOT_INFO });
	/**
	 * setMyName: Name
	 * setMyDescription: New Bot Open Message
	 * setMyShortDescription = About: in Bot Info Description
	 */
	await bot.api.setMyName('New Bot Name2');
	await bot.api.setMyDescription('New bot description2');
	await bot.api.setMyShortDescription('New about text2');
};

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('An error occurred:', error);
		process.exit(1);
	});
