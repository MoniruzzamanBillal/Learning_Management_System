"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TQuizFormData } from "./type/Quiz.type";

type TProps = {
  questionIndex: number;
  control: Control<TQuizFormData>;
  register: UseFormRegister<TQuizFormData>;
  watch: UseFormWatch<TQuizFormData>;
  setValue: UseFormSetValue<TQuizFormData>;
  errors: FieldErrors<TQuizFormData>;
  onRemoveQuestion: () => void;
};

const QuizQuestionFields = ({
  questionIndex,
  control,
  register,
  watch,
  setValue,
  errors,
  onRemoveQuestion,
}: TProps) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const options = watch(`questions.${questionIndex}.options`);

  // ! for marking exactly one option as correct
  const handleMarkCorrect = (optionIndex: number) => {
    options?.forEach((_, index) => {
      setValue(
        `questions.${questionIndex}.options.${index}.isCorrect`,
        index === optionIndex,
      );
    });
  };

  const questionErrors = errors?.questions?.[questionIndex];

  return (
    <div className="QuizQuestionFields border border-gray-200 rounded-md p-3 flex flex-col gap-y-3">
      <div className="flex items-start gap-x-2">
        <div className="flex-1">
          <Input
            placeholder={`Question ${questionIndex + 1}`}
            {...register(`questions.${questionIndex}.questionText`)}
          />
          {questionErrors?.questionText && (
            <span className="text-red-600 text-sm">
              {questionErrors.questionText.message}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRemoveQuestion}
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </div>

      <div className="flex flex-col gap-y-2 pl-2">
        {optionFields.map((optionField, optionIndex) => (
          <div key={optionField.id} className="flex items-center gap-x-2">
            <input
              type="radio"
              name={`correct-${questionIndex}`}
              checked={!!options?.[optionIndex]?.isCorrect}
              onChange={() => handleMarkCorrect(optionIndex)}
            />

            <Input
              placeholder={`Option ${optionIndex + 1}`}
              {...register(
                `questions.${questionIndex}.options.${optionIndex}.optionText`,
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={optionFields.length <= 2}
              onClick={() => removeOption(optionIndex)}
            >
              <Trash2 className="size-4 text-gray-400" />
            </Button>
          </div>
        ))}

        {questionErrors?.options?.message && (
          <span className="text-red-600 text-sm">
            {questionErrors.options.message}
          </span>
        )}
        {questionErrors?.options?.root?.message && (
          <span className="text-red-600 text-sm">
            {questionErrors.options.root.message}
          </span>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() =>
            appendOption({
              optionText: "",
              isCorrect: false,
              optionOrder: optionFields.length,
            })
          }
        >
          Add Option
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestionFields;
