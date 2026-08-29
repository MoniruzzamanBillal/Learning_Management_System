"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import QuizQuestionFields from "./QuizQuestionFields";
import { quizFormValidationSchema } from "./schema/Quiz.schema";
import { TQuizFormData } from "./type/Quiz.type";

type TProps = {
  defaultValues?: TQuizFormData;
  onSubmit: (data: TQuizFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
};

const emptyQuestion = {
  questionText: "",
  questionOrder: 0,
  options: [
    { optionText: "", isCorrect: true, optionOrder: 0 },
    { optionText: "", isCorrect: false, optionOrder: 1 },
  ],
};

const QuizForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: TProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TQuizFormData>({
    resolver: zodResolver(quizFormValidationSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      questions: [emptyQuestion],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  const handleFormSubmit = (data: TQuizFormData) => {
    // questionOrder/optionOrder follow current array position, so a removed
    // or reordered field never leaves a gap or a stale order value behind.
    const payload: TQuizFormData = {
      ...data,
      questions: data.questions.map((question, qIndex) => ({
        ...question,
        questionOrder: qIndex,
        options: question.options.map((option, oIndex) => ({
          ...option,
          optionOrder: oIndex,
        })),
      })),
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-y-4"
    >
      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor="title">Quiz Title</Label>
        <Input id="title" placeholder="Enter quiz title" {...register("title")} />
        {errors?.title && (
          <span className="text-red-600 text-sm">{errors.title.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter a short description"
          {...register("description")}
        />
      </div>

      <div className="flex flex-col gap-y-3">
        <Label>Questions</Label>

        {questionFields.map((questionField, questionIndex) => (
          <QuizQuestionFields
            key={questionField.id}
            questionIndex={questionIndex}
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            onRemoveQuestion={() => removeQuestion(questionIndex)}
          />
        ))}

        {errors?.questions?.message && (
          <span className="text-red-600 text-sm">
            {errors.questions.message}
          </span>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() =>
            appendQuestion({
              ...emptyQuestion,
              questionOrder: questionFields.length,
            })
          }
        >
          Add Question
        </Button>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-prime-100 hover:bg-prime-200 w-fit"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

export default QuizForm;
