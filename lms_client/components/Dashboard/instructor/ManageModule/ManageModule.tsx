"use client";

import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import TableDataLoading from "@/components/shared/TableLoading";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { ManageModuleColumns } from "./ManageModuleColumns";

const ManageModule = () => {
  const router = useRouter();

  const { data: moduleDataWithCourse, isLoading } = useFetchData<any>(
    ["all-modules"],
    "/module/all-module",
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (moduleDataWithCourse) {
    content = moduleDataWithCourse && moduleDataWithCourse?.data && (
      <div className="Tablecontainer mx-auto py-10">
        <GenericTableComponent
          columns={ManageModuleColumns}
          data={moduleDataWithCourse?.data}
          showToolbar={false}
        />
      </div>
    );
  }

  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300 shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4">Manage Modules</h3>

        <Button
          onClick={() => router.push("/dashboard/instructor/add-module")}
          className="mb-4 bg-prime-100 hover:bg-prime-200 cursor-pointer"
        >
          Add Module
        </Button>

        {/* table section  */}
        {content}
      </div>
    </div>
  );
};

export default ManageModule;
