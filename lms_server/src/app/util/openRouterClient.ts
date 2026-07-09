import httpStatus from "http-status";
import OpenAI from "openai";
import AppError from "../Error/AppError";
import config from "../config";

export type TChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type TAskOptions = {
  jsonMode?: boolean;
  temperature?: number;
};

const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouterApiKey,
  timeout: 20_000,
  maxRetries: 0,
  defaultHeaders: {
    "HTTP-Referer": "https://reimentl2.vercel.app",
    "X-Title": "Reiment",
  },
});

// ! free models to try in order - if one is rate limited/down, fall back to the next
const FREE_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",

  "meta-llama/llama-3.2-3b-instruct:free",

  "qwen/qwen3-next-80b-a3b-instruct:free",
];

// ! single choke point every ai feature talks through
export const askOpenRouter = async (
  messages: TChatMessage[],
  options?: TAskOptions,
): Promise<string> => {
  let lastError: unknown;

  for (const model of FREE_MODELS) {
    try {
      const response = await openRouterClient.chat.completions.create({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        ...(options?.jsonMode
          ? { response_format: { type: "json_object" as const } }
          : {}),
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from model");
      }

      return content;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  console.error("openRouterClient: all free models failed", lastError);

  throw new AppError(
    httpStatus.SERVICE_UNAVAILABLE,
    "AI service is busy right now, please try again shortly",
  );
};
