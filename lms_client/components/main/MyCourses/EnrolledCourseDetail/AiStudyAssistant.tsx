"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { TChatMessage, TStudyAssistantResponse } from "@/types/ai.types";
import { TApiResponse } from "@/types/globalTypes";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

type TProps = {
  courseId: string;
};

const AiStudyAssistant = ({ courseId }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [input, setInput] = useState("");

  const { mutateAsync, isPending } = usePost();

  // ! for sending a chat message to the study assistant
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMessage: TChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");

    try {
      const result = (await mutateAsync({
        url: `/ai/study-assistant/${courseId}`,
        payload: { messages: nextMessages },
      })) as TApiResponse<TStudyAssistantResponse>;

      if (result?.data?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.data.reply },
        ]);
      }
    } catch (error) {
      console.log("error = ", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* floating trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-prime-100 text-white shadow-lg hover:bg-prime-200 transition-colors cursor-pointer"
        aria-label="Toggle AI study assistant"
      >
        {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {/* chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          {/* header */}
          <div className="flex items-center gap-2 border-b border-gray-100 bg-prime-100 px-4 py-3 text-white">
            <Sparkles className="size-4" />
            <span className="text-sm font-semibold">Study Assistant</span>
          </div>

          {/* messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500">
                Ask me about the course syllabus, modules, or your progress.
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-prime-100 text-white"
                      : "bg-gray-100 text-gray-800",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-500">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* input */}
          <div className="flex items-end gap-2 border-t border-gray-100 p-3">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              placeholder="Ask a question…"
              className="min-h-9 max-h-24 resize-none text-sm"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isPending || !input.trim()}
              className="shrink-0 bg-prime-100 hover:bg-prime-200"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiStudyAssistant;
