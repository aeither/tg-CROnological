import { Client, CronosZkEvm, Wallet } from '@crypto.com/developer-platform-client';
import { logger, task } from "@trigger.dev/sdk/v3";

export const newWalletTask = task({
  id: "new-wallet",
  maxDuration: 300,
  run: async (payload: any, { ctx }) => {
    logger.log("Starting new wallet creation task", { payload, ctx });

    try {
      // Initialize client
      Client.init({
        chain: CronosZkEvm.Testnet,
        apiKey: process.env.EXPLORER_API_KEY!,
      });

      // Create wallet
      const wallet = await Wallet.create();

      // Call your webhook
      const webhookResponse = await fetch(`${process.env.WEBHOOK_URL}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
          // 'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`
        },
        body: JSON.stringify({
          id: ctx.run.id, // Use trigger.dev run ID as webhook ID
          action: 'create_wallet',
          data: {
            address: wallet.data.address,
            privateKey: wallet.data.privateKey,
            mnemonic: wallet.data.mnemonic,
          },
          timestamp: new Date().toISOString()
        })
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        throw new Error(`Webhook call failed: ${errorText}`);
      }

      logger.log("Wallet created and webhook notified successfully", {
        address: wallet.data.address,
        webhookStatus: webhookResponse.status
      });

      return {
        success: true,
        address: wallet.data.address,
        privateKey: wallet.data.privateKey,
        mnemonic: wallet.data.mnemonic,
        webhookStatus: webhookResponse.status
      };

    } catch (error) {
      logger.error("Failed to create wallet or notify webhook", { error });
      throw error;
    }
  },
});
