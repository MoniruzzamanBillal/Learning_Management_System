"use client";

import TableDataLoading from "@/components/shared/TableLoading";
import GenericTableComponent from "@/components/shared/table/GenericTableComponent";
import { useFetchData } from "@/hooks/useApi";
import { ManageModuleColumns } from "./ManageModuleColumns";

const ManageModule = () => {
  const { data: moduleDataWithCourse, isLoading } = useFetchData<any>(
    ["all-modules"],
    "/module/all-module"
  );

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (moduleDataWithCourse?.data) {
    content = (
      <GenericTableComponent
        columns={ManageModuleColumns}
        data={moduleDataWithCourse?.data}
        showToolbar={false}
      />
    );
  }

  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Module </h3>
        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">{content}</div>
      </div>
    </div>
  );
};

export default ManageModule;
