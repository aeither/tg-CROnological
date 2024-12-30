import { createGroq } from "@ai-sdk/groq";
import { logger, task } from "@trigger.dev/sdk/v3";
import { generateText } from "ai";


export const onchainDataTask = task({
  id: "onchain-data",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: { prompt: string }, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      // maxSteps: 5,
      prompt: payload.prompt,
    });

    logger.log(result.text, { payload, ctx });

    return {
      result: result.text
    }
  },
});