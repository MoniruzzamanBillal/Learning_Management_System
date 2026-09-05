"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TTableRowAction = {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  hidden?: boolean;
  variant?: "default" | "destructive";
};

type TableRowActionsProps = {
  actions: TTableRowAction[];
};

export default function TableRowActions({ actions }: TableRowActionsProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  return (
    <div className="flex items-center justify-center gap-1">
      {visibleActions.map(({ label, icon: Icon, href, onClick, variant }) => {
        const className = cn(
          "h-8 w-8 p-0 text-gray-600 hover:text-gray-900",
          variant === "destructive" &&
            "text-red-600 hover:text-red-700 hover:bg-red-50",
        );

        if (href) {
          return (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="icon"
              title={label}
              className={className}
            >
              <Link href={href} aria-label={label}>
                <Icon className="h-4 w-4" />
              </Link>
            </Button>
          );
        }

        return (
          <Button
            key={label}
            variant="ghost"
            size="icon"
            title={label}
            aria-label={label}
            className={className}
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
