import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

const AddInstructor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // ! for adding new instructor
  const handleAddInstructor = async (data) => {
    console.log("new instructor ");
    console.log(data);
  };

  return (
    <div className="AddInstructorContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
      <div className="AddInstructorWrapper">
        <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
          Add Instructor
        </h1>

        <div className="addNewInstructorForm p-1 w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto">
          <form
            onSubmit={handleSubmit(handleAddInstructor)}
            className=" flex flex-col gap-y-4 "
          >
            {/* Name */}
            <div className="nameContainer flex flex-col gap-y-1">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors?.name && (
                <span className="text-red-600 text-sm">
                  {errors?.name?.message as string}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="emailContainer flex flex-col gap-y-1">
              <Label htmlFor="email">Your Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors?.email && (
                <span className="text-red-600 text-sm">
                  {errors?.email?.message as string}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="passwordContainer flex flex-col gap-y-1">
              <Label htmlFor="password">Your Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors?.password && (
                <span className="text-red-600 text-sm">
                  {errors?.password?.message as string}
                </span>
              )}
            </div>

            <Button
              disabled={isSubmitting}
              className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100     {/* ${
                isSubmitting
                  ? " cursor-not-allowed bg-gray-600 "
                  : "bg-prime50 hover:bg-prime100  "
              } */}  `}
            >
              {isSubmitting ? "Addind Instructor.." : "Add Instructor"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInstructor;
