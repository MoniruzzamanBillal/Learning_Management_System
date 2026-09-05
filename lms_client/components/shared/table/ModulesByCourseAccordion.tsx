"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TModuleData } from "@/types/module.types";
import { ReactNode, useMemo } from "react";

type TCourseInfo = {
  id: string;
  name: string;
  published: boolean;
};

export type TModuleWithCourse = TModuleData<TCourseInfo>;

type TCourseGroup = {
  course: TCourseInfo;
  modules: TModuleWithCourse[];
};

type TProps = {
  modules: TModuleWithCourse[];
  renderActions: (module: TModuleWithCourse) => ReactNode;
};

const groupModulesByCourse = (
  modules: TModuleWithCourse[],
): TCourseGroup[] => {
  const groups = new Map<string, TCourseGroup>();

  modules.forEach((module) => {
    const course = module.course as TCourseInfo;
    const existing = groups.get(course.id);

    if (existing) {
      existing.modules.push(module);
    } else {
      groups.set(course.id, { course, modules: [module] });
    }
  });

  return Array.from(groups.values());
};

export default function ModulesByCourseAccordion({
  modules,
  renderActions,
}: TProps) {
  const courseGroups = useMemo(() => groupModulesByCourse(modules), [modules]);

  if (!courseGroups.length) {
    return (
      <div className="p-10 text-center text-lg border border-prime-50/50 bg-prime-50/5 rounded-[8px]">
        No Data Available
      </div>
    );
  }

  return (
    <div className="border border-prime-50/50 bg-prime-50/5 rounded-[8px] overflow-hidden px-4">
      <Accordion type="multiple" className="w-full">
        {courseGroups.map(({ course, modules: courseModules }) => (
          <AccordionItem key={course.id} value={course.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-gray-900">
                  {course.name}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    course.published
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {course.published ? "Published" : "Unpublished"}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {courseModules.length}{" "}
                  {courseModules.length === 1 ? "module" : "modules"}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                {courseModules.map((module, index) => (
                  <div
                    key={module.id}
                    className={`flex items-center justify-between gap-4 px-4 py-3 ${
                      index !== courseModules.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <span className="font-medium text-sm text-gray-800">
                      {module.title}
                    </span>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {module.videos?.length ?? 0} videos
                      </span>
                      {renderActions(module)}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
