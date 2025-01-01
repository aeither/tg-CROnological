import { Client, CronosZkEvm, Wallet } from '@crypto.com/developer-platform-client';
import { logger, task } from "@trigger.dev/sdk/v3";

export const newWalletNotTask = task({
  id: "new-wallet-not",
  maxDuration: 300,
  run: async (payload: { chatId: string }, { ctx }) => {
    logger.log("Starting new wallet creation task", { payload, ctx });

    try {
      // Initialize client
      Client.init({
        chain: CronosZkEvm.Testnet,
        apiKey: process.env.EXPLORER_API_KEY!,
      });

      // Create wallet
      const wallet = await Wallet.create();

      // Prepare telegram message
      const botToken = process.env.TG_BOT_TOKEN!;
      const message = `New wallet created!\nAddress: ${wallet.data.address}`;

      // Send telegram notification
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: payload.chatId,
            text: message,
          }),
        }
      );

      if (!telegramResponse.ok) {
        throw new Error('Failed to send Telegram notification');
      }

      return {
        success: true,
        address: wallet.data.address,
        privateKey: wallet.data.privateKey,
        mnemonic: wallet.data.mnemonic,
        notification: await telegramResponse.json(),
      };

    } catch (error) {
      logger.error("Failed to create wallet or notify webhook", { error });
      throw error;
    }
  },
});
