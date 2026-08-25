"use client";

import ModulesByCourseAccordion, {
  TModuleWithCourse,
} from "@/components/shared/table/ModulesByCourseAccordion";
import TableDataLoading from "@/components/shared/table/TableLoading";
import TableRowActions from "@/components/shared/table/TableRowActions";
import { useFetchData } from "@/hooks/useApi";
import { Eye } from "lucide-react";

const ManageModule = () => {
  const { data: moduleDataWithCourse, isLoading } = useFetchData<
    TModuleWithCourse[]
  >(["all-modules"], "/module/all-module");

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (moduleDataWithCourse?.data) {
    content = (
      <ModulesByCourseAccordion
        modules={moduleDataWithCourse.data}
        renderActions={(module) => (
          <TableRowActions
            actions={[
              {
                label: "View Details",
                icon: Eye,
                href: `/dashboard/admin/module-detail/${module.id}`,
              },
            ]}
          />
        )}
      />
    );
  }

  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Module </h3>
        {/* module list section  */}
        <div className="Tablecontainer mx-auto  ">{content}</div>
      </div>
    </div>
  );
};

export default ManageModule;
