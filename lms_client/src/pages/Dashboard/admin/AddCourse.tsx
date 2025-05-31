import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddNewCourseMutation } from "@/redux/features/course/course.api";
import {
  addCourseValidationSchema,
  courseSchemas,
} from "@/schemas/Course.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { z } from "zod";

import { addCourseFunction } from "@/functions/course.functions";
import { useGetAllInstructorQuery } from "@/redux/features/instructor/isntructor.api";
import { TInstructor } from "@/types/user.types";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
};

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

const AddCourse = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [instructorOptions, setInstructorOptions] =
    useState<{ value: string; label: string }[]>();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { data: instructorData, isLoading: instructorDataLoading } =
    useGetAllInstructorQuery(undefined);

  const [addNewCourse, { isLoading }] = useAddNewCourseMutation();

  // console.log(instructorData?.data);
  // console.log(instructorOptions);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchemas?.addCourseValidationSchema),
  });

  // ! for changing the image preview url
  const changeImagePreviewUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e?.target?.files?.[0];
    if (imageFile) {
      const previewUrl = URL.createObjectURL(imageFile);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // ! for removing a image after select image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

  type TAddCourseType = z.infer<typeof addCourseValidationSchema>;

  const handleNavigate = () => {
    navigate(-1);
  };

  // ! for adding new course
  const handleAddNewCourse = async (data: Partial<TAddCourseType>) => {
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

    await addCourseFunction(formData, addNewCourse, handleNavigate);
  };

  // ! useeffect for handling instructor select data option
  useEffect(() => {
    if (instructorData?.data) {
      const instructorOptionsData = instructorData?.data?.map(
        (instructor: TInstructor) => ({
          value: instructor?._id,
          label: instructor?.name,
        })
      );

      setInstructorOptions(instructorOptionsData);
    }
  }, [instructorData?.data]);

  return (
    <>
      {(isLoading || instructorDataLoading) && <FormSubmitLoading />}

      <div className="AddCourseContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md ">
        <div className="addCourseWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Course
          </h1>

          {/* add course form  */}
          <div className="addCourseForm p-1 w-[98%] xsm:w-[92%]  m-auto ">
            <form
              onSubmit={handleSubmit(handleAddNewCourse)}
              className=" flex flex-col gap-y-4 "
            >
              {/* coure name  */}
              <div className="nameContainer flex flex-col gap-y-1.5">
                <Label htmlFor="name">Course Name </Label>
                <Input
                  id="name"
                  type="text"
                  className="  "
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

              {/* image field  */}
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

              {/* description field  */}
              <div className="descriptionContainer flex flex-col gap-y-1.5 h-[22rem]  ">
                <Label htmlFor="description">Course Description </Label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Course Description is required" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-full w-full font-medium bg-white "
                      modules={modules}
                    />
                  )}
                />

                {errors?.description && (
                  <span className="text-red-600 text-sm">
                    {errors?.description?.message as string}
                  </span>
                )}
              </div>

              {/* price  */}

              <div className="priceContainer flex flex-col gap-y-1.5 mt-[4rem] ">
                <Label htmlFor="price">Course Price</Label>
                <Input
                  id="price"
                  type="number"
                  className="  "
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

              {/* category */}
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
                        (option) => option?.value === field?.value
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

              {/* instructors  */}
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
                        field?.value?.includes(option?.value)
                      )}
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions?.map((option) => option?.value)
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
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime50 hover:bg-prime100  "
                }   `}
              >
                {isSubmitting ? "Adding New Course..." : "Add Course "}
              </Button>

              {/*  */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourse;
