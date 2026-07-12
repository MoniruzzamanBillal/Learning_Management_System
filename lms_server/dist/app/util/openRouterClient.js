"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOpenRouter = void 0;
const http_status_1 = __importDefault(require("http-status"));
const openai_1 = __importDefault(require("openai"));
const AppError_1 = __importDefault(require("../Error/AppError"));
const config_1 = __importDefault(require("../config"));
const openRouterClient = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: config_1.default.openRouterApiKey,
    timeout: 20000,
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
const askOpenRouter = (messages, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let lastError;
    for (const model of FREE_MODELS) {
        try {
            const response = yield openRouterClient.chat.completions.create(Object.assign({ model,
                messages, temperature: (_a = options === null || options === void 0 ? void 0 : options.temperature) !== null && _a !== void 0 ? _a : 0.7 }, ((options === null || options === void 0 ? void 0 : options.jsonMode)
                ? { response_format: { type: "json_object" } }
                : {})));
            const content = (_c = (_b = response.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
            if (!content) {
                throw new Error("Empty response from model");
            }
            return content;
        }
        catch (error) {
            lastError = error;
            continue;
        }
    }
    console.error("openRouterClient: all free models failed", lastError);
    throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, "AI service is busy right now, please try again shortly");
});
exports.askOpenRouter = askOpenRouter;
