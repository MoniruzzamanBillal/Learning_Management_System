import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerInstructorFunction } from "@/functions/auth.functions";
import { useInstructorRegistrationMutation } from "@/redux/features/auth/auth.api";
import { addInstructorSchema, userSchemas } from "@/schemas/User.schemas";
import { userRoleConts } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const AddInstructor = () => {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchemas?.addInstructorSchema),
  });

  const [instructorRegistration, { isLoading }] =
    useInstructorRegistrationMutation();

  const handleNavigate = () => {
    navigate(-1);
  };

  // ! for removing a image after select image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

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

  type AddInstructorFormData = Partial<z.infer<typeof addInstructorSchema>>;
  // ! for adding new instructor
  const handleAddInstructor = async (data: AddInstructorFormData) => {
    const imageFile = data?.image?.[0];

    const payload = {
      name: data?.name,
      email: data?.email,
      userRole: userRoleConts?.instructor,
    };

    const formData = new FormData();
    if (imageFile) {
      formData.append("profileImg", imageFile);
    }

    formData.append("data", JSON.stringify(payload));

    await registerInstructorFunction(
      formData,
      instructorRegistration,
      handleNavigate
    );

    //
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="AddInstructorContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="AddInstructorWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Add Instructor
          </h1>

          <div className="addNewInstructorForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto ">
            <form
              onSubmit={handleSubmit(handleAddInstructor)}
              className=" flex flex-col gap-y-4 "
            >
              {/* Name */}
              <div className="nameContainer flex flex-col gap-y-1">
                <Label htmlFor="name">Instructor Name</Label>
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
                <Label htmlFor="email">Instructor Email Address</Label>
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
    </>
  );
};

export default AddInstructor;
