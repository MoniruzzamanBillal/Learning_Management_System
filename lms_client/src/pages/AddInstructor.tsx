import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addInstructorSchema, userSchemas } from "@/schemas/User.schemas";
import { userRoleConts } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddInstructor = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchemas?.addInstructorSchema),
  });

  // ! for removing a image after select image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

  type AddInstructorFormData = Partial<z.infer<typeof addInstructorSchema>>;
  // ! for adding new instructor
  const handleAddInstructor = async (data: AddInstructorFormData) => {
    const imageFile = data?.image?.[0];

    console.log("image file = ", imageFile);

    const payload = {
      name: data?.name,
      email: data?.email,
      password: data?.password,
      userRole: userRoleConts?.instructor,
    };

    console.log(payload);
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

            {/* profile image  */}
            <div className="imageContainer flex flex-col gap-y-1">
              <Label htmlFor="image">Profile Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                {...register("image")}
                ref={(e) => {
                  register("image").ref(e);
                  imageInputRef.current = e;
                }}
                // ref={imageInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setImagePreview(previewUrl);
                  } else {
                    setImagePreview(null);
                  }
                }}
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
