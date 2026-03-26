"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";

type TableActionMenuProps<T> = {
  rowData: T;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  editLabel?: string;
  deleteLabel?: string;
};

export default function TableActionMenu<T>({
  rowData,
  onEdit,
  onDelete,
  editLabel = "Edit Info",
  deleteLabel = "Delete",
}: TableActionMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex justify-center w-full">
        <Button className="  text-gray-800 bg-[#E7F2F1] hover:bg-[#E7F2F1] border-none outline-none focus-visible:ring-0 ">
          <EllipsisVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="rounded-[8px] py-4 px-3 space-y-3 bg-red-300 "
      >
        {onEdit && (
          <DropdownMenuItem
            className="flex flex-row items-center gap-x-2"
            onClick={() => onEdit(rowData)}
          >
            <SquarePen className="size-5 text-neutral-50" />
            <span className="text-[0.875rem] leading-5.25 font-medium text-neutral-50">
              {editLabel}
            </span>
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            className="flex flex-row items-center gap-x-2"
            onClick={() => onDelete(rowData)}
          >
            <Trash2 className="size-5 text-neutral-50" />
            <span className="text-[0.875rem] leading-5.25 font-medium text-neutral-50">
              {deleteLabel}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
