"use client";

import ModulesByCourseAccordion, {
  TModuleWithCourse,
} from "@/components/shared/table/ModulesByCourseAccordion";
import TableDataLoading from "@/components/shared/table/TableLoading";
import TableRowActions from "@/components/shared/table/TableRowActions";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/useApi";
import { ClipboardList, Eye, HelpCircle, Plus, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

const ManageModule = () => {
  const router = useRouter();

  const { data: moduleDataWithCourse, isLoading } = useFetchData<
    TModuleWithCourse[]
  >(["all-modules"], "/module/all-module");

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (moduleDataWithCourse?.data) {
    content = (
      <div className="Tablecontainer mx-auto py-10">
        <ModulesByCourseAccordion
          modules={moduleDataWithCourse.data}
          renderActions={(module) => {
            const isPublished = (module.course as { published: boolean })
              .published;

            return (
              <TableRowActions
                actions={[
                  {
                    label: "View Details",
                    icon: Eye,
                    href: `/dashboard/instructor/module-detail/${module.id}`,
                  },
                  {
                    label: "Update Module",
                    icon: SquarePen,
                    href: `/dashboard/instructor/update-module/${module.id}`,
                    hidden: isPublished,
                  },
                  {
                    label: "Add New Video",
                    icon: Plus,
                    href: `/dashboard/instructor/add-video/${module.id}`,
                    hidden: isPublished,
                  },
                  {
                    label: "Manage Quiz",
                    icon: HelpCircle,
                    href: `/dashboard/instructor/manage-quiz/${module.id}`,
                    hidden: isPublished,
                  },
                  {
                    label: "Manage Assignment",
                    icon: ClipboardList,
                    href: `/dashboard/instructor/manage-assignment/${module.id}`,
                  },
                ]}
              />
            );
          }}
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

        {/* module list section  */}
        {content}
      </div>
    </div>
  );
};

export default ManageModule;
