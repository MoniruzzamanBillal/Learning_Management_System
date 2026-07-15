"use client";

import DeleteModal from "@/components/shared/DeleteModal";
import PageHeader from "@/components/shared/PageHeader/PageHeader";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import TableDataLoading from "@/components/shared/TableLoading";
import { useDeleteData, useFetchData } from "@/hooks/useApi";
import { TAdminReview } from "@/types/review.types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function ManageReviewPage() {
  const { data: reviewData, isLoading } = useFetchData<TAdminReview[]>(
    ["all-reviews"],
    "/review/all",
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const deleteReview = useDeleteData([["all-reviews"]]);
  const handleDeleteItem = async (id: string) => {
    if (!id) return;
    try {
      await deleteReview.mutateAsync({ url: `/review/${id}` });
    } catch (error) {
      console.error("Failed to delete review", error);
    }
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
  };

  const reviewColumns = useMemo<ColumnDef<TAdminReview>[]>(
    () => [
      {
        id: "course",
        header: "Course",
        enableSorting: false,
        cell: ({ row }) => <p>{row.original.courseId?.name ?? "—"}</p>,
      },
      {
        id: "student",
        header: "Student",
        enableSorting: false,
        cell: ({ row }) => <p>{row.original.userId?.name ?? "—"}</p>,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={
                  index < row.original.rating
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-300"
                }
                size={14}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: "comment",
        header: "Comment",
        enableSorting: false,
        cell: ({ row }) => (
          <p className="max-w-[280px] truncate" title={row.original.comment}>
            {row.original.comment}
          </p>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        enableSorting: true,
        cell: ({ row }) => (
          <p className="whitespace-nowrap">
            {format(new Date(row.original.createdAt), "dd-MMM-yyyy")}
          </p>
        ),
      },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setDeleteItemId(row.original._id);
            }}
            className="text-red-600 hover:text-red-800"
            title="Delete review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ),
      },
    ],
    [],
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (reviewData?.data) {
    content = (
      <GenericTableComponent
        data={reviewData.data}
        columns={reviewColumns}
        showToolbar={false}
      />
    );
  }

  return (
    <div className="ManageReviewContainer">
      <div className="ManageReviewWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <div className="mb-6">
          <PageHeader headerTitle="Manage Reviews" showAddButton={false} />
        </div>

        {content}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleDeleteFunction={handleDeleteItem}
          id={deleteItemId ?? ""}
          alertMessage="Are you sure you want to delete this review? This cannot be undone by the student, but they will be able to leave a new review afterward."
          btnText="Delete"
        />
      </div>
    </div>
  );
}
