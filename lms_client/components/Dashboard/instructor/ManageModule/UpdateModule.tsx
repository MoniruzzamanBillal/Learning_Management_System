/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateModuleFunction } from "@/functions/module.function";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { useGetUser } from "@/hooks/useGetUser";
import { TCourseData } from "@/types/course.types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

type TModuleFormData = {
  course: string;
  title: string;
};

const UpdateModule = () => {
  const { moduleId } = useParams();
  const userInfo = useGetUser();
  const router = useRouter();

  const { data: moduleData, isLoading: moduleDataLoading } = useFetchData<any>(
    ["module-detail", moduleId as string],
    `/module/module-detail/${moduleId}`,
    { enabled: !!moduleId },
  );

  const {
    data: instructorAssignedCourses,
    isLoading: fetchingCourseDataLoading,
  } = useFetchData<any>(
    ["instructor-courses", userInfo?.userId || ""],
    `/course/instructor-courses/${userInfo?.userId}`,
    { enabled: !!userInfo?.userId },
  );

  const [courseOptions, setCourseOptions] =
    useState<{ value: string; label: string }[]>();

  const updateModuleMutation = usePatch([
    ["module-detail", moduleId as string],
    ["all-modules"],
  ]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TModuleFormData>();

  const handleNavigate = () => {
    router.back();
  };

  const handleUpdateModule = async (data: TModuleFormData) => {
    await updateModuleFunction(
      data,
      updateModuleMutation.mutateAsync,
      moduleId as string,
      handleNavigate,
    );
  };

  useEffect(() => {
    if (instructorAssignedCourses?.data) {
      const courseOptionsData = instructorAssignedCourses?.data?.map(
        (course: TCourseData) => ({
          value: course?._id,
          label: course?.name,
        }),
      );

      setCourseOptions(courseOptionsData);
    }
  }, [instructorAssignedCourses?.data]);

  useEffect(() => {
    if (moduleData?.data) {
      const module = moduleData.data;

      reset({
        course: module?.course?._id,
        title: module?.title,
      });
    }
  }, [moduleData?.data, reset]);

  return (
    <>
      {(updateModuleMutation.isPending ||
        fetchingCourseDataLoading ||
        moduleDataLoading) && <FormSubmitLoading />}

      <div className="UpdateModuleContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="UpdateModuleWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Module
          </h1>

          <div className="addModuleForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto">
            <form
              onSubmit={handleSubmit(handleUpdateModule)}
              className="flex flex-col gap-y-4"
            >
              <div className="courseContainer flex flex-col gap-y-1.5">
                <Label htmlFor="course">Course Name </Label>
                <Controller
                  name="course"
                  control={control}
                  rules={{ required: "Select one Course" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={courseOptions}
                      value={courseOptions?.find(
                        (option) => option?.value === field?.value,
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select a course"
                    />
                  )}
                />

                {errors?.course && (
                  <span className="text-red-600 text-sm">
                    {errors?.course?.message as string}
                  </span>
                )}
              </div>

              <div className="titleContainer flex flex-col gap-y-1.5">
                <Label htmlFor="title">Module Title </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter Module Title"
                  {...register("title", {
                    required: "Module Title is required !!!",
                  })}
                />
                {errors?.title && (
                  <span className="text-red-600 text-sm">
                    {errors?.title?.message as string}
                  </span>
                )}
              </div>

              <Button
                disabled={isSubmitting || updateModuleMutation.isPending}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime-50 hover:bg-prime-100 ${
                  isSubmitting || updateModuleMutation.isPending
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-prime-50 hover:bg-prime-100"
                }`}
              >
                {isSubmitting || updateModuleMutation.isPending
                  ? "Updating Module..."
                  : "Update Module"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateModule;
