"use client";

import DeleteModal from "@/components/shared/Modal/DeleteModal";
import { Button } from "@/components/ui/button";
import {
  createQuizFunction,
  deleteQuizFunction,
  updateQuizFunction,
} from "@/functions/quiz.functions";
import { useDeleteData, useFetchData, usePatch, usePost } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import QuizForm from "./QuizForm";
import { TQuizFormData, TQuizManage } from "./type/Quiz.type";

const ManageQuiz = () => {
  const router = useRouter();
  const { moduleId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryKey = [`quiz-manage-${moduleId}`];

  const { data: quizData, isLoading } = useFetchData<TQuizManage | null>(
    queryKey,
    `/quiz/manage/${moduleId}`,
    { enabled: !!moduleId },
  );

  const { mutateAsync: createQuiz, isPending: isCreating } = usePost([
    queryKey,
  ]);
  const { mutateAsync: updateQuiz, isPending: isUpdating } = usePatch([
    queryKey,
  ]);
  const { mutateAsync: deleteQuiz, isPending: isDeleting } = useDeleteData([
    queryKey,
  ]);

  const quiz = quizData?.data ?? null;

  const handleNavigateBack = () => {
    router.push("/dashboard/instructor/manage-module");
  };

  // ! for creating or updating this module's quiz
  const handleSubmit = async (data: TQuizFormData) => {
    if (quiz) {
      await updateQuizFunction(data, updateQuiz, quiz.id, handleNavigateBack);
    } else {
      await createQuizFunction(
        { moduleId: moduleId as string, ...data },
        createQuiz,
        handleNavigateBack,
      );
    }
  };

  // ! for deleting this quiz
  const handleDelete = async () => {
    if (!quiz) return;
    await deleteQuizFunction(
      { url: `/quiz/${quiz.id}` },
      deleteQuiz,
      handleNavigateBack,
    );
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="ManageQuizContainer bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="brand text-2xl font-medium">
          {quiz ? "Edit Quiz" : "Create Quiz"}
        </h3>

        {quiz && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            Delete Quiz
          </Button>
        )}
      </div>

      <QuizForm
        defaultValues={
          quiz
            ? {
                title: quiz.title,
                description: quiz.description ?? "",
                questions: quiz.questions,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        submitLabel={quiz ? "Update Quiz" : "Create Quiz"}
      />

      {quiz && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleDeleteFunction={handleDelete}
          id={quiz.id}
          alertMessage="This will permanently delete this quiz. This action cannot be undone."
        />
      )}
    </div>
  );
};

export default ManageQuiz;
