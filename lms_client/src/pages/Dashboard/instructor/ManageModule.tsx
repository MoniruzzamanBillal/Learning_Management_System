import TableDataLoading from "@/components/shared/TableLoading";
import { Button } from "@/components/ui/button";
import {
  ManageModuleColumn,
  ManageModuleTable,
} from "@/components/ui/instructor/ManageModule";
import { useAllModuleQuery } from "@/redux/features/module/module.api";
import { useNavigate } from "react-router-dom";

const ManageModule = () => {
  const navigate = useNavigate();

  const { data: moduleDataWithCourse, isLoading } =
    useAllModuleQuery(undefined);

  // console.log(moduleDataWithCourse?.data);
  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (moduleDataWithCourse) {
    content = moduleDataWithCourse && moduleDataWithCourse?.data && (
      <div className="Tablecontainer mx-auto py-10">
        <ManageModuleTable
          columns={ManageModuleColumn}
          data={moduleDataWithCourse?.data}
        />
      </div>
    );
  }

  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Modules</h3>

        <Button
          onClick={() => navigate("/dashboard/instructor/add-module")}
          className="mb-4 bg-prime100 hover:bg-prime200 cursor-pointer"
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
