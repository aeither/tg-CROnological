// botHandlers.ts
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { solana } from "@goat-sdk/wallet-solana";

import { sendSOL } from "@goat-sdk/core";
import { Connection, Keypair } from "@solana/web3.js";
import { configure, tasks } from "@trigger.dev/sdk/v3";
import * as bip39 from "bip39";
import type { Bot } from "grammy";
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
      const res = await tasks.trigger("new-wallet-not", {})
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

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      tools: await getTools(env),
      maxSteps: 5,
      prompt: "send 0.0001 SOL to Bk7CrPhiH1bxtNf1CSVqg4arKevE61CUFontX7jumsy8",
    });

    console.log(result.text);

    await ctx.reply(result.text);
  });
};

const getTools = async (env: Env) => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const mnemonic = env.WALLET_MNEMONIC;

  if (!mnemonic) {
    throw new Error("WALLET_MNEMONIC is not set in the environment");
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const keypair = Keypair.fromSeed(Uint8Array.from(seed).subarray(0, 32));
  const pkey = keypair.publicKey.toBase58();
  console.log("🚀 ~ keypair:", pkey);

  const tools = await getOnChainTools({
    wallet: solana({
      keypair: keypair as any,
      connection: connection as any,
    }),
    plugins: [sendSOL()],
  });

  return tools;
};
