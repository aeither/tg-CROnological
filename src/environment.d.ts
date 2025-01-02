import type { UserFromGetMe } from "grammy/types";
export default interface Env {
  BOT_TOKEN: string;
  BOT_TOKEN_DEV?: string;
  BOT_INFO: UserFromGetMe;
  NODE_ENV?: string;
  NODE_ENV: string;
  GROQ_API_KEY: string;
  WALLET_MNEMONIC: string;
  TRIGGER_SECRET_KEY: string;
  EXPLORER_API_KEY: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
