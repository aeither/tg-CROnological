// botHandlers.ts
import { createGroq } from "@ai-sdk/groq";
import { configure, tasks } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import type { Bot } from "grammy";
import { z } from 'zod';
import type Env from "../environment";

require("dotenv").config();

export const setupBotHandlers = (bot: Bot, env: Env) => {

  configure({
    secretKey: env.TRIGGER_SECRET_KEY, // starts with tr_dev_ or tr_prod_
  });

  // Handle the /start command
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Welcome! I can help you check Solana balances. Send me a Solana address."
    );
  });
  bot.command("id", async (ctx) => {
    console.log('chatId: ', ctx.chat.id.toString());

    await ctx.reply(
      "chat id"
    );
  });
  bot.command("trigger", async (ctx) => {
    try {
      console.log("start trigger")
      const res = await tasks.trigger("new-wallet-not", { "chatId": ctx.chat.id.toString(), "action": "hello123" })
      console.log("🚀 ~ main ~ res:", res)

      await ctx.reply(
        "Welcome! I can help you check Solana balances. Send me a Solana address."
      );
    } catch (error) {
      console.error(error)
      await ctx.reply(
        "somehting went wrong"
      );
    }
  });

  // Handle regular messages
  bot.on("message", async (ctx) => {
    try {
      const text = ctx.message.text;

      const groq = createGroq({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: env.GROQ_API_KEY,
      });

      const systemPrompt = `You are an assistant that interprets user requests and schedules blockchain-related actions. You can only perform two actions:
1. create_wallet - When users request to create/generate a new wallet
2. fetch_onchain_data - When users request blockchain/token/NFT data

For timed requests, include a timer in seconds. Example: "create a wallet in 5 minutes" would return (both string type):
{
  "action": "create_wallet",
  "timer": "300"
}

If no time is specified, omit the timer field.`;

      const result = await generateObject({
        model: groq("llama-3.3-70b-versatile"),
        schema: z.object({
          action: z.string(),
          timer: z.string(),
        }),
        prompt: `${systemPrompt}\n\nUser: ${text}`,
      });

      const res = await tasks.trigger("new-wallet-not", {
        "chatId": ctx.chat.id.toString(),
        "action": result.object.action,
        "timer": result.object.timer.toString()
      });
      console.log("🚀 ~ main ~ res:", res)

      // Calculate scheduled time
      const scheduledTime = new Date(Date.now() + Number.parseInt(result.object.timer) * 1000);
      const formattedTime = scheduledTime.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric'
      });

      await ctx.reply(`Scheduled: ${result.object.action} at ${formattedTime}`);
    } catch (error) {
      console.error('Error occurred while processing message:', error);
      await ctx.reply('An error occurred while processing your message. Please try again later.');
    }
  });

};
