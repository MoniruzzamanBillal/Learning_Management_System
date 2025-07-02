import TableDataLoading from "@/components/shared/TableLoading";
import {
  manageModuleColumns,
  ManageModuleTable,
} from "@/components/ui/admin/manageModule";
import { useAllModuleQuery } from "@/redux/features/module/module.api";

const ManageModule = () => {
  const { data: moduleDataWithCourse, isLoading } =
    useAllModuleQuery(undefined);

  // console.log(moduleDataWithCourse?.data);

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (moduleDataWithCourse) {
    content = moduleDataWithCourse && moduleDataWithCourse?.data && (
      <ManageModuleTable
        columns={manageModuleColumns}
        data={moduleDataWithCourse?.data}
      />
    );
  }

  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Module </h3>
        {/*  */}

        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">{content}</div>
      </div>
    </div>
  );
};

export default ManageModule;
