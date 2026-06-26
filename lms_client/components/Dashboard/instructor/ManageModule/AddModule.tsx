"use client";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addModuleFunction } from "@/functions/module.function";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useGetUser } from "@/hooks/useGetUser";
import { TCourseData } from "@/types/course.types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

type TModuleFormData = {
  course: string;
  title: string;
};

const AddModuleForm = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const userInfo = useGetUser();
  const router = useRouter();

  const [courseOptions, setCourseOptions] =
    useState<{ value: string; label: string }[]>();

  const {
    data: instructorAssignedCourses,
    isLoading: fetchingCourseDataLoading,
  } = useFetchData<any>(
    ["instructor-courses", userInfo?.userId || ""],
    "/course/instructor-courses",
    { enabled: !!userInfo?.userId },
  );

  const addModuleMutation = usePost([["instructor-courses"], ["all-modules"]]);

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

  const handleAddNewModule = async (data: TModuleFormData) => {
    const payload = {
      ...data,
      instructor: userInfo?.userId,
    };

    await addModuleFunction(
      payload,
      addModuleMutation.mutateAsync,
      handleNavigate,
    );
  };

  useEffect(() => {
    if (instructorAssignedCourses?.data) {
      const courseOptionsData = instructorAssignedCourses?.data
        ?.filter((course: TCourseData) => !course?.published)
        ?.map((course: TCourseData) => ({
          value: course?._id,
          label: course?.name,
        }));

      setCourseOptions(courseOptionsData);
    }
  }, [instructorAssignedCourses?.data]);

  useEffect(() => {
    if (courseId) {
      reset({
        course: courseId,
      });
    }
  }, [courseId, reset]);

  return (
    <>
      {(fetchingCourseDataLoading || addModuleMutation.isPending) && (
        <FormSubmitLoading />
      )}

      <div className="AddModuleContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddModuleWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Module
          </h1>

          <div className="addModuleForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto">
            <form
              onSubmit={handleSubmit(handleAddNewModule)}
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
                    required: "Module Name is required !!!",
                  })}
                />
                {errors?.title && (
                  <span className="text-red-600 text-sm">
                    {errors?.title?.message as string}
                  </span>
                )}
              </div>

              <Button
                disabled={isSubmitting || addModuleMutation.isPending}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime-50 hover:bg-prime-100 ${
                  isSubmitting || addModuleMutation.isPending
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-prime-50 hover:bg-prime-100"
                }`}
              >
                {isSubmitting || addModuleMutation.isPending
                  ? "Adding New Module..."
                  : "Add Module"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const AddModule = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddModuleForm />
    </Suspense>
  );
};

export default AddModule;
