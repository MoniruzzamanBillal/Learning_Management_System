import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addModuleFunction } from "@/functions/module.function";
import { useGetInstructorAssignedCourseQuery } from "@/redux/features/course/course.api";
import { useAddModuleMutation } from "@/redux/features/module/module.api";
import { TCourseData } from "@/types/course.types";
import { useGetUser } from "@/utils/sharedFunction";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";

type TModuleFormData = {
  course: string;
  title: string;
};

const AddModule = () => {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");

  const userInfo = useGetUser();

  const navigate = useNavigate();

  const [courseOptions, setCourseOptions] =
    useState<{ value: string; label: string }[]>();

  if (!userInfo?.userId) {
    throw new Error("Something went wrong !!!");
  }

  const {
    data: instructorAssignedCourses,
    isLoading: fetchingCourseDataLoading,
  } = useGetInstructorAssignedCourseQuery(userInfo?.userId, {
    skip: !userInfo?.userId,
  });

  const [addModule, { isLoading: moduleAddingLoading }] =
    useAddModuleMutation();

  // console.log(instructorAssignedCourses?.data);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TModuleFormData>();

  const handleNavigate = () => {
    navigate(-1);
  };

  // ! for adding  new module
  const handleAddNewModule = async (data: TModuleFormData) => {
    const payload = {
      ...data,
      instructor: userInfo?.userId,
    };

    await addModuleFunction(payload, addModule, handleNavigate);
  };

  // ! useeffect for handling course select data option
  useEffect(() => {
    if (instructorAssignedCourses?.data) {
      const courseOptionsData = instructorAssignedCourses?.data?.map(
        (course: TCourseData) => ({
          value: course?._id,
          label: course?.name,
        })
      );

      setCourseOptions(courseOptionsData);
    }
  }, [instructorAssignedCourses?.data]);

  // ! for handling course name , if course id given as search params
  useEffect(() => {
    if (courseId) {
      reset({
        course: courseId,
      });
    }
  }, [courseId, reset]);

  return (
    <>
      {(fetchingCourseDataLoading || moduleAddingLoading) && (
        <FormSubmitLoading />
      )}

      <div className="AddModuleContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddModuleWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Module
          </h1>

          {/* add module form  */}
          <div className="addModuleForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto ">
            <form
              onSubmit={handleSubmit(handleAddNewModule)}
              className=" flex flex-col gap-y-4 "
            >
              {/* course name  */}
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
                        (option) => option?.value === field?.value
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

              {/* module title  */}
              <div className="titleContainer flex flex-col gap-y-1.5">
                <Label htmlFor="title">Module Title </Label>
                <Input
                  id="title"
                  type="text"
                  className="  "
                  placeholder="Enter Module Title  "
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
                disabled={isSubmitting}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime50 hover:bg-prime100  "
                }   `}
              >
                {isSubmitting ? "Adding New Module..." : "Add Module "}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddModule;
