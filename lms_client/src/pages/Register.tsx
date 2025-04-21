import Wrapper from "@/components/shared/Wrapper";
import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/functions/auth.functions";
import { useUserRegistrationMutation } from "@/redux/features/auth/auth.api";
import { userRegistrationSchema, userSchemas } from "@/schemas/User.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const Register = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchemas?.userRegistrationSchema),
  });

  const [userRegistration, { isLoading }] = useUserRegistrationMutation();

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

  type registerUserType = Partial<z.infer<typeof userRegistrationSchema>>;

  //   ! for registration
  const handleRegistration = async (data: registerUserType) => {
    const imageFile = data?.image?.[0];

    const payload = {
      name: data?.name,
      email: data?.email,
      password: data?.password,
    };

    const formData = new FormData();

    if (imageFile) {
      formData.append("profileImg", imageFile);
    }

    formData.append("data", JSON.stringify(payload));

    const result = await registerUser(formData, userRegistration);

    if (result) {
      navigate("/login");
    }
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="registrationContainer w-full min-h-screen  imageCenter flex items-center justify-center    ">
        <Wrapper className="formContainer py-14  ">
          <div className="    w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-200  backdrop-blur bg-opacity-60 border   ">
            <p className=" mb-3 xsm:mb-5 sm:mb-8 text-xl xsm:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-700   ">
              Register
            </p>

            {/*  */}

            {/* form starts  */}
            <form
              onSubmit={handleSubmit(handleRegistration)}
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
                {errors.name && (
                  <span className="text-red-600 text-sm">
                    {errors.name.message as string}
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
                {errors.email && (
                  <span className="text-red-600 text-sm">
                    {errors.email.message as string}
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
                {errors.password && (
                  <span className="text-red-600 text-sm">
                    {errors.password.message as string}
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
                {isSubmitting ? "Signing up.." : "Sign Up"}
              </Button>
            </form>
            {/* form ends */}

            {/*  */}

            <div className="text-center  mt-6  ">
              <a className="right-0 inline-block text-sm font-semibold align-baseline text-gray-900 hover:text-gray-950   ">
                Already have any account ?{" "}
                <span className=" text-blue-700 font-bold cursor-pointer ">
                  <Link to={`/login`}>Login </Link>
                </span>
              </a>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default Register;
