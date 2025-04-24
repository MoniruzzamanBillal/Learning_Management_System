import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUser } from "@/utils/sharedFunction";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const courseOptions = [
  { value: "react", label: "React" },
  { value: "node", label: "Node.js" },
  { value: "next", label: "Next.js" },
  { value: "mongo", label: "MongoDB" },
];

type TModuleFormData = {
  course: string;
  title: string;
};

const AddModule = () => {
  const userInfo = useGetUser();

  //   console.log("user info = ", userInfo);
  //   console.log("user id = ", userInfo?.userId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TModuleFormData>();

  // ! for adding  new module
  const handleAddNewModule = async (data: TModuleFormData) => {
    console.log("add new module ");

    const payload = {
      ...data,
      instructor: userInfo?.userId,
    };

    console.log(payload);
  };

  return (
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
              <Label htmlFor="title">Course Name </Label>
              <Input
                id="title"
                type="text"
                className="  "
                placeholder="Enter Course Name "
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
  );
};

export default AddModule;
