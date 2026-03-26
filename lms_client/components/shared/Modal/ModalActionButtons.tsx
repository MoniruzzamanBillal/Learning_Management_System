"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

type TModalActionButtonsProps = {
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function ModalActionButtons({
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
}: TModalActionButtonsProps) {
  return (
    <div className="flex gap-3 mt-8">
      <DialogClose asChild className="flex-1">
        <Button
          variant="outline"
          className="h-11 bg-surface border border-neutral-700 rounded-[8px]"
        >
          {cancelText}
        </Button>
      </DialogClose>

      <PrimaryButton
        className="flex-1"
        onClick={onConfirm}
        disabled={isLoading}
      >
        {confirmText}
      </PrimaryButton>
    </div>
  );
}
