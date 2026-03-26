"use client";

import { Plus } from "lucide-react";

import PrimaryButton from "../PrimaryButton/PrimaryButton";

type TpageProps = {
  headerTitle?: string;
  btnText?: string;
  onClick?: () => void;
  showAddButton?: boolean;
};

export default function PageHeader({
  btnText,
  onClick,
  headerTitle,

  showAddButton = true,
}: TpageProps) {
  return (
    <div className=" flex justify-between items-center ">
      {/* left section  */}
      <div className="   ">
        {headerTitle && (
          <h1 className=" font-semibold text-2xl text-neutral-900 dark:text-neutral-100  mb-2 ">
            {headerTitle}
          </h1>
        )}
      </div>

      {/* right button section  */}
      {showAddButton && (
        <PrimaryButton onClick={onClick}>
          <span className="flex items-center justify-center text-neutral-50 size-5 ">
            <Plus />
          </span>

          <span> {btnText ?? "Add"} </span>
        </PrimaryButton>
      )}
    </div>
  );
}
