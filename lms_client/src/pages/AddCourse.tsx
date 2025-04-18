import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddNewCourseMutation } from "@/redux/features/course/course.api";
import { courseSchemas } from "@/schemas/Course.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const instructorOptions = [
  { value: "react", label: "React" },
  { value: "node", label: "Node.js" },
  { value: "next", label: "Next.js" },
  { value: "mongo", label: "MongoDB" },
];

const categoryOptions = [
  { value: "react", label: "React" },
  { value: "node", label: "Node.js" },
  { value: "next", label: "Next.js" },
  { value: "mongo", label: "MongoDB" },
];

const AddCourse = () => {
  const [addNewCourse, { isLoading }] = useAddNewCourseMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchemas.addCourseValidationSchema),
  });

  // ! for adding new course
  const handleAddNewCourse = async (data) => {
    console.log("new course ");
    console.log(data);
  };

  return (
    <div className="AddCourseContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
      <div className="addCourseWrapper">
        <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
          Add Course
        </h1>

        {/* add course form  */}
        <div className="addCourseForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto ">
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

            {/* description field  */}
            <div className="descriptionContainer flex flex-col gap-y-1.5">
              <Label htmlFor="description">Course Description </Label>
              <Textarea
                id="description"
                className="  "
                placeholder="Enter Course Description "
                {...register("description", {
                  required: "Course Description is required !!!",
                })}
              />
              {errors?.description && (
                <span className="text-red-600 text-sm">
                  {errors?.description?.message as string}
                </span>
              )}
            </div>

            {/* price  */}

            <div className="priceContainer flex flex-col gap-y-1.5">
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
  );
};

export default AddCourse;
