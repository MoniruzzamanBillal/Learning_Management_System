import Wrapper from "@/components/shared/Wrapper";
import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/functions/auth.functions";
import { useUserRegistrationMutation } from "@/redux/features/auth/auth.api";
import { TRegistrationPayload } from "@/types/auth.types";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [userRegistration, { isLoading }] = useUserRegistrationMutation();

  //   ! for registration
  const handleRegistration = async (data: TRegistrationPayload) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

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
