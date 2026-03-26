"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { ReactNode } from "react";

type TBaseDialogProps = {
  open: boolean;
  onClose: () => void;

  children: ReactNode;
  className?: string;
  title?: string;
  showDeleteIcon?: boolean;
};

export default function BaseModal({
  open,
  onClose,
  children,
  className,
  showDeleteIcon = false,
  title,
}: TBaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "p-6 rounded-[8px] border border-table-border  w-full bg-surface max-h-[92vh] overflow-y-auto ",
          className,
        )}
      >
        {showDeleteIcon && (
          <DialogHeader>
            <DialogTitle className="  size-12  ">
              <Trash2 className="  size-12  " />
            </DialogTitle>
          </DialogHeader>
        )}

        {title && (
          <DialogHeader>
            <DialogTitle className=" font-semibold text-[1.5rem] leading-[1.5rem] text-neutral-50  ">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}
