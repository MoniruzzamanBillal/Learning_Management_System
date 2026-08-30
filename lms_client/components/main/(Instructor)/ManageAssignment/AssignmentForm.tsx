"use client";

import TextEditorTipTap from "@/components/shared/input/ControlledTipTapTextEditor/TextEditorTipTap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { assignmentFormValidationSchema } from "./schema/Assignment.schema";
import { TAssignmentFormData } from "./type/Assignment.type";

type TProps = {
  defaultValues?: TAssignmentFormData;
  onSubmit: (data: TAssignmentFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
};

const AssignmentForm = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: TProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TAssignmentFormData>({
    resolver: zodResolver(assignmentFormValidationSchema),
    defaultValues: defaultValues ?? {
      title: "",
      instructions: "",
      dueDate: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4"
    >
      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor="title">Assignment Title</Label>
        <Input
          id="title"
          placeholder="Enter assignment title"
          {...register("title")}
        />
        {errors?.title && (
          <span className="text-red-600 text-sm">{errors.title.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor="instructions">Instructions</Label>
        <Controller
          name="instructions"
          control={control}
          render={({ field }) => (
            <TextEditorTipTap
              value={field.value}
              onChange={field.onChange}
              placeholder="Write the assignment instructions..."
            />
          )}
        />
        {errors?.instructions && (
          <span className="text-red-600 text-sm">
            {errors.instructions.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-y-1.5">
        <Label htmlFor="dueDate">Due Date (optional)</Label>
        <Input id="dueDate" type="date" {...register("dueDate")} />
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

export default AssignmentForm;
