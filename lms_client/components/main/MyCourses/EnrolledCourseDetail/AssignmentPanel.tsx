"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitAssignmentFunction } from "@/functions/assignment.functions";
import { useFetchData, useUpdateData } from "@/hooks/useApi";
import { useRef, useState } from "react";
import { TAssignmentTake } from "./type/Assignment.type";

type TProps = {
  courseId: string;
  moduleId: string;
};

const AssignmentPanel = ({ courseId, moduleId }: TProps) => {
  const queryKey = [`assignment-take-${courseId}-${moduleId}`];
  const endpoint = `/assignment/take/${courseId}/${moduleId}`;

  const {
    data: assignmentData,
    isLoading,
    refetch,
  } = useFetchData<TAssignmentTake>(queryKey, endpoint, {
    enabled: !!courseId && !!moduleId,
  });

  const data = assignmentData?.data;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasContent, setHasContent] = useState(
    !!data?.submission?.content?.trim(),
  );

  const { mutateAsync: submitAssignment, isPending: isSubmitting } =
    useUpdateData([queryKey]);

  // ! for submitting/resubmitting the assignment
  const handleSubmit = async () => {
    if (!data) return;
    const content = textareaRef.current?.value?.trim() ?? "";
    if (!content) return;

    const submitResponse = await submitAssignmentFunction(
      {
        url: `/assignment/submit/${courseId}/${data.assignmentId}`,
        payload: { content },
      },
      submitAssignment,
    ).catch(() => null);

    if (!submitResponse) {
      // the backend rejects a submit against an already-graded assignment
      // (e.g. a stale tab) — refetch so the panel flips to locked state
      // instead of staying stuck on a rejected form.
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="AssignmentPanelContainer bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <p className="text-gray-500">Loading assignment...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const isGraded = data.submission?.status === "graded";

  return (
    <div className="AssignmentPanelContainer bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <p className="text-xl font-medium mb-1">{data.title}</p>

      {data.dueDate && (
        <p className="text-sm text-gray-500 mb-2">
          Due: {new Date(data.dueDate).toLocaleDateString()}
        </p>
      )}

      <div
        className="assignmentInstructions prose max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: data.instructions }}
      ></div>

      <Textarea
        key={data.assignmentId}
        ref={textareaRef}
        defaultValue={data.submission?.content ?? ""}
        placeholder="Paste a GitHub repo link, a document link, or your answer..."
        disabled={isGraded}
        onChange={(e) => setHasContent(!!e.target.value.trim())}
        className="min-h-32"
      />

      {isGraded ? (
        <div className="mt-4 flex flex-col gap-y-2">
          <p className="text-lg font-semibold">
            Score: {data.submission?.score} / 10
          </p>
          {data.submission?.feedback && (
            <p className="text-sm text-gray-700">
              Feedback: {data.submission.feedback}
            </p>
          )}
          <p className="text-sm text-gray-500">
            This assignment has been graded. Ask your instructor to reopen it
            if you need to resubmit.
          </p>
        </div>
      ) : (
        <Button
          className="mt-4 bg-prime-100 hover:bg-prime-200"
          disabled={!hasContent || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? "Submitting..."
            : data.submission
              ? "Update Submission"
              : "Submit"}
        </Button>
      )}
    </div>
  );
};

export default AssignmentPanel;
