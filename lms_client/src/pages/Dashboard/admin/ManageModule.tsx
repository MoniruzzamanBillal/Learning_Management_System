import TableDataLoading from "@/components/shared/TableLoading";
import {
  manageModuleColumns,
  ManageModuleTable,
} from "@/components/ui/admin/manageModule";
import { useGetAllCourseWithModuleQuery } from "@/redux/features/course/course.api";

const ManageModule = () => {
  const { data: moduleDataWithCourse, isLoading } =
    useGetAllCourseWithModuleQuery(undefined);

  // console.log(moduleDataWithCourse?.data);

  return (
    <>
      {isLoading && <TableDataLoading />}

      <div className="ManageModuleContainer">
        <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
          <h3 className="brand text-2xl font-medium mb-4 "> Manage Module </h3>
          {/*  */}

          {/* table section  */}
          <div className="Tablecontainer mx-auto py-10">
            {moduleDataWithCourse?.data && (
              <ManageModuleTable
                columns={manageModuleColumns}
                data={moduleDataWithCourse?.data}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageModule;
