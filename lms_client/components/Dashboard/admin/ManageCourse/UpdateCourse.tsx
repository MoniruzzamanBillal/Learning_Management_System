"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import TextEditorTipTap from "@/components/input/ControlledTipTapTextEditor/TextEditorTipTap";
import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { updateCourseFunction } from "@/functions/course.functions";
import { useFetchData, useUpdateData } from "@/hooks/useApi";
import { updateCourseValidationSchema } from "@/schemas/Course.schemas";
import { TCourseData } from "@/types/course.types";
import { TInstructor } from "@/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const animatedComponents = makeAnimated();

const categoryOptions = [
  { value: "Web Development", label: "Web Development" },
  { value: "App Development", label: "App Development" },
  { value: "Software Development", label: "Software Development" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "DevOps", label: "DevOps" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Blockchain Development", label: "Blockchain Development" },
];

const UpdateCourse = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  if (!courseId) {
    throw new Error("Something went wrong!! ");
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [instructorOptions, setInstructorOptions] =
    useState<{ value: string; label: string }[]>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateCourseValidationSchema),
  });

  const { mutateAsync: updateCourse, isPending: courseUpdatingLoading } =
    useUpdateData([["all-courses-admin"], ["admin-course-detail", courseId]]);

  const { data: instructorData, isLoading: instructorDataLoading } =
    useFetchData<TInstructor[]>(["all-instructors"], "/user/get-instructors");

  const { data: courseDataRes, isLoading: courseDataLoading } =
    useFetchData<TCourseData>(
      ["admin-course-detail", courseId],
      `/course/admin-course-detail/${courseId}`,
    );

  const courseData = courseDataRes?.data;

  const changeImagePreviewUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e?.target?.files?.[0];
    if (imageFile) {
      const previewUrl = URL.createObjectURL(imageFile);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleNavigate = () => {
    router.back();
  };

  type TUpdateCourseType = z.infer<typeof updateCourseValidationSchema>;

  const handleUpdateCorse = async (data: Partial<TUpdateCourseType>) => {
    const payload = {
      name: data?.name,
      description: data?.description,
      price: data?.price,
      category: data?.category,
      instructors: data?.instructors,
    };

    const formData = new FormData();

    const imageFile = data?.image?.[0];

    if (imageFile) {
      formData.append("courseCover", imageFile);
    }

    formData.append("data", JSON.stringify(payload));

    await updateCourseFunction(
      courseId,
      formData,
      updateCourse,
      handleNavigate,
    );
  };

  useEffect(() => {
    if (instructorData?.data) {
      const instructorOptionsData = instructorData?.data?.map(
        (instructor: TInstructor) => ({
          value: instructor?._id,
          label: instructor?.name,
        }),
      );

      setInstructorOptions(instructorOptionsData);
    }
  }, [instructorData?.data]);

  useEffect(() => {
    if (courseData) {
      const course = courseData;

      reset({
        name: course?.name,
        description: course?.description,
        price: course?.price,
        category: course?.category,
        instructors: course?.instructors,
      });

      if (course?.courseCover) {
        setImagePreview(course.courseCover);
      }
    }
  }, [courseData, reset]);

  return (
    <>
      {(courseUpdatingLoading ||
        instructorDataLoading ||
        courseDataLoading) && <FormSubmitLoading />}

      <div className="UpdateCourseContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="UpdateCourseWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Course
          </h1>

          <div className="updateCourseForm p-1 w-[98%] xsm:w-[92%]  m-auto">
            <form
              onSubmit={handleSubmit(handleUpdateCorse as any)}
              className=" flex flex-col gap-y-4 "
            >
              <div className="nameContainer flex flex-col gap-y-1.5">
                <Label htmlFor="name">Course Name </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Course Name "
                  {...register("name", {
                    required: "Course Name is required !!!",
                  })}
                />
                {errors?.name && (
                  <span className="text-red-600 text-sm">
                    {errors?.name?.message as string}
                  </span>
                )}
              </div>

              <div className="imageContainer flex flex-col gap-y-1">
                <Label htmlFor="image">Course Cover Image </Label>
                <Input
                  id="image"
                  type="file"
                  {...register("image")}
                  ref={(e) => {
                    register("image").ref(e);
                    imageInputRef.current = e;
                  }}
                  onChange={(e) => changeImagePreviewUrl(e)}
                />

                {imagePreview && (
                  <div className="relative mt-2 w-fit">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X />
                    </button>
                  </div>
                )}
              </div>

              <div className="descriptionContainer flex flex-col gap-y-1.5">
                <Label htmlFor="description">Course Description </Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Course Description is required" }}
                  render={({ field }) => (
                    <TextEditorTipTap
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors?.description && (
                  <span className="text-red-600 text-sm">
                    {errors?.description?.message as string}
                  </span>
                )}
              </div>

              <div className="priceContainer flex flex-col gap-y-1.5">
                <Label htmlFor="price">Course Price</Label>
                <Input
                  id="price"
                  type="number"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  placeholder="Enter Course Price "
                  {...register("price", {
                    valueAsNumber: true,
                    required: "Course Price is required !!!",
                  })}
                />
                {errors?.price && (
                  <span className="text-red-600 text-sm">
                    {errors?.price?.message as string}
                  </span>
                )}
              </div>

              <div className="categoryContainer flex flex-col gap-y-1.5">
                <Label htmlFor="category">Course Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Course Category is required !!!" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categoryOptions}
                      value={categoryOptions?.find(
                        (option) => option?.value === field?.value,
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select technologies..."
                    />
                  )}
                />
                {errors?.category && (
                  <span className="text-red-600 text-sm">
                    {errors?.category?.message as string}
                  </span>
                )}
              </div>

              <div className="instructorsContainer flex flex-col gap-y-1.5">
                <Label htmlFor="instructors">Instructors Name </Label>
                <Controller
                  name="instructors"
                  control={control}
                  rules={{ required: "Select at least one instructor!" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={instructorOptions}
                      isMulti
                      components={animatedComponents}
                      value={instructorOptions?.filter((option) =>
                        field?.value?.includes(option?.value),
                      )}
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions?.map((option) => option?.value),
                        )
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select technologies..."
                    />
                  )}
                />

                {errors?.instructors && (
                  <span className="text-red-600 text-sm">
                    {errors?.instructors?.message as string}
                  </span>
                )}
              </div>

              <Button
                disabled={isSubmitting}
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime-50 hover:bg-prime-100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime-50 hover:bg-prime-100  "
                }   `}
              >
                {isSubmitting ? "Updating Course..." : "Update Course "}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCourse;
