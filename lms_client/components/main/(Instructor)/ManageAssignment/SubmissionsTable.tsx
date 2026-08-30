"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  gradeSubmissionFunction,
  reopenSubmissionFunction,
} from "@/functions/assignment.functions";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { useState } from "react";
import { TAssignmentSubmissionManage } from "./type/Assignment.type";

const isUrl = (value: string) => /^https?:\/\//.test(value.trim());

type TProps = {
  assignmentId: string;
};

const SubmissionsTable = ({ assignmentId }: TProps) => {
  const queryKey = [`assignment-submissions-${assignmentId}`];

  const { data: submissionsData, isLoading } = useFetchData<
    TAssignmentSubmissionManage[]
  >(queryKey, `/assignment/submissions/${assignmentId}`, {
    enabled: !!assignmentId,
  });

  const [gradingSubmissionId, setGradingSubmissionId] = useState<
    string | null
  >(null);
  const [score, setScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const { mutateAsync: gradeSubmission, isPending: isGrading } = usePatch([
    queryKey,
  ]);
  const { mutateAsync: reopenSubmission, isPending: isReopening } = usePatch([
    queryKey,
  ]);

  const submissions = submissionsData?.data ?? [];

  const openGradeForm = (submissionId: string) => {
    setGradingSubmissionId(submissionId);
    setScore("");
    setFeedback("");
  };

  const handleGrade = async (submissionId: string) => {
    const scoreValue = Number(score);

    if (Number.isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
      return;
    }

    const result = await gradeSubmissionFunction(
      {
        url: `/assignment/grade/${submissionId}`,
        payload: { score: scoreValue, feedback: feedback || undefined },
      },
      gradeSubmission,
    ).catch(() => null);

    if (result) {
      setGradingSubmissionId(null);
    }
  };

  const handleReopen = async (submissionId: string) => {
    await reopenSubmissionFunction(
      { url: `/assignment/reopen/${submissionId}` },
      reopenSubmission,
    ).catch(() => null);
  };

  if (isLoading) {
    return <p className="p-4">Loading submissions...</p>;
  }

  if (!submissions.length) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        No submissions yet for this assignment.
      </p>
    );
  }

  return (
    <div className="SubmissionsTableContainer mt-6">
      <h4 className="text-lg font-medium mb-3">Submissions</h4>

      <div className="flex flex-col gap-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-gray-50 rounded-lg border border-gray-200 p-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium">{submission.user.name}</p>
                <p className="text-sm text-gray-500">
                  {submission.user.email}
                </p>
              </div>

              <span
                className={`w-fit text-xs font-semibold px-2 py-1 rounded-full ${
                  submission.status === "graded"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {submission.status}
              </span>
            </div>

            <div className="mt-2">
              {isUrl(submission.content) ? (
                <a
                  href={submission.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {submission.content}
                </a>
              ) : (
                <p className="break-words">{submission.content}</p>
              )}
            </div>

            {submission.status === "graded" ? (
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Score: {submission.score} / 10
                  </p>
                  {submission.feedback && (
                    <p className="text-sm text-gray-600">
                      Feedback: {submission.feedback}
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isReopening}
                  onClick={() => handleReopen(submission.id)}
                >
                  Reopen
                </Button>
              </div>
            ) : gradingSubmissionId === submission.id ? (
              <div className="mt-3 flex flex-col gap-y-2 max-w-sm">
                <Input
                  type="number"
                  min={0}
                  max={10}
                  placeholder="Score (0-10)"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
                <Textarea
                  placeholder="Feedback (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex gap-x-2">
                  <Button
                    size="sm"
                    className="bg-prime-100 hover:bg-prime-200"
                    disabled={
                      isGrading ||
                      score.trim() === "" ||
                      Number(score) < 0 ||
                      Number(score) > 10
                    }
                    onClick={() => handleGrade(submission.id)}
                  >
                    {isGrading ? "Saving..." : "Save Grade"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setGradingSubmissionId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                className="mt-3 bg-prime-100 hover:bg-prime-200"
                onClick={() => openGradeForm(submission.id)}
              >
                Grade
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsTable;
