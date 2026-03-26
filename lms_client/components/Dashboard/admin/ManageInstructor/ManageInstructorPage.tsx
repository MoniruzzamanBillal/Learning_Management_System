"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useApi";

type TData = {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
};

export default function ManageInstructorPage() {
  const { data: isntructorData, isLoading } = useFetchData<TData>(
    ["all-instructors"],
    "/user/get-instructors",
  );

  console.log("isntructorData = ", isntructorData?.data);

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  }

  return (
    <div className="ManageInstructorsContainer">
      <div className="ManageInstructorsWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 ">Manage Instructors</h3>

        <Button
          //   onClick={() => navigate("/dashboard/admin/add-instructor")}
          className="mb-4 bg-prime-100 hover:bg-prime-100 cursor-pointer"
        >
          Add Instructors
        </Button>

        {/* table section  */}
        {content}
      </div>
    </div>
  );
}
