import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const newWalletNotTask = task({
  id: "new-wallet-not",
  maxDuration: 300,
  run: async (payload: {
    chatId: string;
    timer?: string;
    action: "create_wallet" | "fetch_onchain_data";
  }, { ctx }) => {
    logger.log("Starting webhook call", { payload, ctx });

    try {
      if (payload.timer) {
        const seconds = Number.parseInt(payload.timer);
        await wait.for({ seconds });
      }

      const webhookResponse = await fetch(`${process.env.WEBHOOK_URL}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: ctx.run.id,
          action: payload.action,
          data: {
            chatId: payload.chatId,
          },
          timestamp: new Date().toISOString()
        })
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        throw new Error(`Webhook call failed: ${errorText}`);
      }

      const result = await webhookResponse.json();
      logger.log("Webhook called successfully", { result });

      return {
        success: true,
        ...(result as object)
      };

    } catch (error) {
      logger.error("Failed to call webhook", { error });
      throw error;
    }
  },
});
