"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePost } from "@/hooks/useApi";
import { TCourseAdvisorResponse } from "@/types/ai.types";
import { ArrowRight, Loader2, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TApiResponse<T> = {
  data: T;
  statusCode?: number;
  success: boolean;
  message: string;
};

const AiCourseAdvisor = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending, data } = usePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError(null);
    mutate(
      {
        url: "/ai/course-advisor",
        payload: { query: query.trim() },
      },
      {
        onError: () => {
          setError("Failed to get recommendations. Please try again.");
        },
      },
    );
  };

  const response = data as TApiResponse<TCourseAdvisorResponse> | undefined;
  const recommendations = response?.data?.recommendations ?? [];

  if (!isExpanded) {
    return (
      <div className="max-w-3xl mx-auto mb-8  ">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-prime-200 hover:shadow-md transition-all duration-200 text-sm text-gray-600 cursor-pointer "
        >
          <Sparkles className="h-4 w-4 text-prime-100 shrink-0" />
          <span>
            Not sure what to learn?{" "}
            <span className="font-semibold text-prime-100">Ask AI</span>
          </span>
          <ArrowRight className="h-4 w-4 text-prime-100 shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mb-8 ">
      <Card className="relative border-indigo-100 bg-white/80 backdrop-blur-sm shadow-lg  ">
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          aria-label="Collapse AI Course Advisor"
          className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <CardContent className="pt-6 pb-6 px-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4  ">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-prime-100" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">AI Course Advisor</h3>
              <p className="text-sm text-gray-500">
                Describe what you want to learn and get personalized
                recommendations
              </p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="mb-4  ">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g. I want to learn backend development"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isPending}
                autoFocus
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isPending || !query.trim()}
                className="bg-prime-100 hover:bg-prime-200 text-white whitespace-nowrap"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Asking AI...
                  </>
                ) : (
                  <>
                    Ask AI
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>

          {/* Results */}
          {recommendations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700">
                Recommended for you:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.courseId}
                    href={`/courses/${rec.courseId}`}
                    className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-prime-200 hover:shadow-md transition-all duration-200 flex flex-col h-full"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                        <Sparkles className="h-4 w-4 text-prime-100" />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-prime-100 transition-colors line-clamp-1 flex-1">
                        {rec.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {rec.category}
                      </span>
                      <span className="font-bold text-prime-100 text-sm">
                        ${rec.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                      {rec.reason}
                    </p>

                    <div className="flex items-center gap-1 text-prime-100 text-sm font-medium mt-2 pt-2 border-t border-gray-50 group-hover:gap-2 transition-all">
                      View Course
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data && !isPending && recommendations.length === 0 && (
            <div className="pt-4 border-t border-gray-100 text-center py-6">
              <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                Couldn{"t"} find a close match. Try rephrasing your goal.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiCourseAdvisor;
