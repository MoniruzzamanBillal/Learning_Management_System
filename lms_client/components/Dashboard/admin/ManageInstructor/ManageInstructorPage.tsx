"use client";

import PageHeader from "@/components/shared/PageHeader/PageHeader";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import TableDataLoading from "@/components/shared/TableLoading";
import { useFetchData } from "@/hooks/useApi";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<
    TInstructorData | undefined
  >();

  const handleEditMenuClick = (instructor: TInstructorData) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleDeleteItem = () => {
    console.log("delete instructor id =", deleteItemId);
    // Add your delete API call here
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
      //       <TableActionMenu
      //         rowData={instructor}
      //         onDelete={(data: TInstructorData) => {
      //           setIsDeleteModalOpen(true);
      //           setDeleteItemId(data._id);
      //         }}
      //         onEdit={(data: TInstructorData) => handleEditMenuClick(data)}
      //       />
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
            // onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* table section  */}
        {content}
      </div>
    </div>
  );
}
