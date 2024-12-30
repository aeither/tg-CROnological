import { Client, CronosZkEvm, Wallet } from '@crypto.com/developer-platform-client';
import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const newWalletTask = task({
  id: "new-wallet",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: any, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 1 });
    Client.init({
      chain: CronosZkEvm.Testnet,
      apiKey: process.env.EXPLORER_API_KEY!,
    });

    const wallet = await Wallet.create();

    return {
      address: wallet.data.address,
      privateKey: wallet.data.privateKey,
      mnemonic: wallet.data.mnemonic,
    }
  },
});