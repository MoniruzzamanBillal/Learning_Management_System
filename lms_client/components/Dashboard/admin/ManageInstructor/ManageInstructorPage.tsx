"use client";

import DeleteModal from "@/components/shared/DeleteModal";
import PageHeader from "@/components/shared/PageHeader/PageHeader";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import TableDataLoading from "@/components/shared/TableLoading";
import { useDeleteData, useFetchData } from "@/hooks/useApi";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type TInstructorData = {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
};

export default function ManageInstructorPage() {
  const { data: instructorData, isLoading } = useFetchData<TInstructorData[]>(
    ["all-instructors"],
    "/user/get-instructors",
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<
    TInstructorData | undefined
  >();
  const router = useRouter();

  // Edit functionality placeholder (not implemented yet)
  const handleEditMenuClick = (instructor: TInstructorData) => {
    console.log("Edit clicked for", instructor);
    setSelectedInstructor(instructor);
  };

  const deleteInstructor = useDeleteData([["all-instructors"]]);
  const handleDeleteItem = async (id: string) => {
    if (!id) return;
    try {
      await deleteInstructor.mutateAsync({
        url: `/user/delete-instructor/${id}`,
      });
      // Refresh will be handled by react-query invalidation
    } catch (error) {
      console.error("Failed to delete instructor", error);
    }
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
  };

  const instructorColumns = useMemo<ColumnDef<TInstructorData>[]>(
    () => [
      {
        accessorKey: "profilePicture",
        header: "Profile",
        enableSorting: false,
        cell: ({ row }) => {
          const instructor = row.original;
          return (
            <div>
              <Image
                height={1280}
                width={1280}
                src={instructor.profilePicture}
                alt={instructor.name}
                className=" size-16 rounded-full object-cover"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
      },

      // {
      //   id: "actions",
      //   header: "Action",
      //   enableSorting: false,
      //   cell: ({ row }) => {
      //     const instructor = row.original;
      //     return (
      //       <>
      //         <button
      //           onClick={() => {
      //             setIsDeleteModalOpen(true);
      //             setDeleteItemId(instructor._id);
      //           }}
      //           className="text-red-600 hover:underline text-sm"
      //         >
      //           Delete
      //         </button>
      //         {/* Placeholder for edit – could open a modal in future */}
      //       </>
      //     );
      //   },
      // },
    ],
    [],
  );

  console.log("isntructorData = ", instructorData?.data);

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (instructorData?.data) {
    content = (
      <GenericTableComponent
        data={instructorData.data}
        columns={instructorColumns}
        showToolbar={false}
      />
    );
  }

  return (
    <div className="ManageInstructorsContainer">
      <div className="ManageInstructorsWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <div className="mb-6">
          <PageHeader
            btnText="Add Instructor"
            headerTitle="Manage Instructors"
            onClick={() =>
              router.push("/dashboard/admin/manage-instructor/add-instructor")
            }
          />
        </div>

        {/* table section  */}
        {content}
        {/* Delete confirmation modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleDeleteFunction={handleDeleteItem}
          id={deleteItemId ?? ""}
          alertMessage="Are you sure you want to delete this instructor?"
          btnText="Delete"
        />
      </div>
    </div>
  );
}
