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
    const text = ctx.message.text;

    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: env.GROQ_API_KEY,
    });

    const systemPrompt = "You are an assistant that interprets user requests and schedules actions. For example, if the user says 'create a wallet in 5 minutes', you should return an object with the action 'create a wallet' and a timer in seconds, e.g., 300 seconds.";

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
      "timer": result.object.timer
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
  });

};
