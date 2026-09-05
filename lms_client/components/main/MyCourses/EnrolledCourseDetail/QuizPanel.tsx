"use client";

import { Button } from "@/components/ui/button";
import { submitQuizFunction } from "@/functions/quiz.functions";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useState } from "react";
import {
  TQuizQuestionTake,
  TQuizTakeData,
  TQuizTakeResultMode,
} from "./type/Quiz.type";

type TProps = {
  courseId: string;
  moduleId: string;
};

const isResultMode = (
  data: TQuizTakeData | undefined,
): data is TQuizTakeResultMode => !!data && "attemptId" in data;

const QuizPanel = ({ courseId, moduleId }: TProps) => {
  const queryKey = [`quiz-take-${courseId}-${moduleId}`];
  const endpoint = `/quiz/take/${courseId}/${moduleId}`;

  const { data: quizData, isLoading } = useFetchData<TQuizTakeData>(
    queryKey,
    endpoint,
    { enabled: !!courseId && !!moduleId },
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedResult, setSubmittedResult] =
    useState<TQuizTakeResultMode | null>(null);

  const { mutateAsync: submitQuiz, isPending: isSubmitting } = usePost([
    queryKey,
  ]);

  const data = quizData?.data;
  const result = submittedResult ?? (isResultMode(data) ? data : null);

  // ! for picking one option per question
  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // ! for submitting all answers at once
  const handleSubmit = async () => {
    if (!data || isResultMode(data)) return;

    const submitResponse = await submitQuizFunction(
      { url: `/quiz/submit/${courseId}/${data.quizId}`, payload: { answers } },
      submitQuiz,
    ).catch(() => null);

    if (submitResponse?.data) {
      setSubmittedResult(submitResponse.data);
    }
  };

  if (isLoading) {
    return (
      <div className="QuizPanelContainer bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const questions: TQuizQuestionTake[] = data.questions;
  const allAnswered = questions.every((q) => !!answers[q.questionId]);

  return (
    <div className="QuizPanelContainer bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {!result && "title" in data && (
        <>
          <p className="text-xl font-medium mb-1">{data.title}</p>
          {data.description && (
            <p className="text-sm text-gray-500 mb-4">{data.description}</p>
          )}
        </>
      )}

      {result && (
        <p className="text-lg font-semibold mb-4">
          Your Score: {result.score} / {result.totalQuestions}
        </p>
      )}

      <div className="flex flex-col gap-y-6">
        {questions.map((question, qIndex) => (
          <div key={question.questionId} className="questionBlock">
            <p className="font-medium mb-2">
              {qIndex + 1}. {question.questionText}
            </p>

            <div className="flex flex-col gap-y-2">
              {question.options.map((option) => {
                const isSelected = result
                  ? option.wasSelected
                  : answers[question.questionId] === option.optionId;

                let optionClass =
                  "flex items-center gap-x-2 rounded-md border p-2 cursor-pointer";

                if (result) {
                  optionClass +=
                    " cursor-default " +
                    (option.isCorrect
                      ? " bg-green-50 border-green-400 text-green-700"
                      : option.wasSelected
                        ? " bg-red-50 border-red-400 text-red-700"
                        : " border-gray-200");
                } else {
                  optionClass += isSelected
                    ? " border-prime-100 bg-prime-50/40"
                    : " border-gray-200";
                }

                return (
                  <label key={option.optionId} className={optionClass}>
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      checked={!!isSelected}
                      disabled={!!result}
                      onChange={() =>
                        handleSelectOption(question.questionId, option.optionId)
                      }
                    />
                    {option.optionText}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <Button
          className="mt-6 bg-prime-100 hover:bg-prime-200"
          disabled={!allAnswered || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      )}
    </div>
  );
};

export default QuizPanel;
