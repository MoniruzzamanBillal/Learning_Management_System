"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type PrimaryButtonProps = {
  children: React.ReactNode;

  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

const PrimaryButton = ({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer ",
        " font-bold text-[0.875rem] ",
        "bg-prime-100 text-neutral-50 ",
        "hover:bg-prime-200",
        "active:scale-[0.98]",

        className,
      )}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
