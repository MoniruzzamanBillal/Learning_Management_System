import Wrapper from "@/components/shared/Wrapper";
import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogInMutation } from "@/redux/features/auth/auth.api";
import { setUser } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hook";
import { TLoginPayload } from "@/types/auth.types";
import { TUser } from "@/types/globalTypes";
import { verifyToken } from "@/utils/verifyToken";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logIn, { isLoading }] = useLogInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginPayload>();

  // ! for login
  const handleLogin = async (data: TLoginPayload) => {
    const toastId = toast.loading("Loginng in...");

    try {
      const result = await logIn(data);

      //  *  for any  error
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (result?.error as any)?.data?.message;
        console.log(errorMessage);
        toast.error(errorMessage, {
          id: toastId,
          duration: 1400,
        });
      }

      if (result?.data?.data?.needsPasswordChange) {
        const token = result?.data?.token;
        const user = verifyToken(token) as TUser;
        dispatch(setUser({ user, token }));
        navigate("/change-password");

        toast.success(result?.data?.message, { id: toastId, duration: 1400 });
      } else if (result?.data?.success) {
        const token = result?.data?.token;

        const user = verifyToken(token) as TUser;

        dispatch(setUser({ user, token }));
        toast.success(result?.data?.message, { id: toastId, duration: 1400 });
        navigate("/");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMsg = (error as any)?.data?.message;
      toast.error(errorMsg, { id: toastId, duration: 1800 });
      console.log(error);
    }

    //
  };

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="LoginContainer w-full min-h-screen  imageCenter flex items-center justify-center    ">
        <Wrapper className="formContainer py-14  ">
          <div className=" w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-200  backdrop-blur bg-opacity-60 border   ">
            <p className=" mb-3 xsm:mb-5 sm:mb-8 text-xl xsm:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-800   ">
              Log in
            </p>

            {/*  */}

            {/* form starts  */}
            <form
              onSubmit={handleSubmit(handleLogin)}
              className=" flex flex-col gap-y-4 "
            >
              <div className="emailContainer flex flex-col gap-y-1">
                <Label htmlFor="email">Your email address</Label>
                <Input
                  id="email"
                  type="email"
                  className="  "
                  placeholder="Enter Email"
                  {...register("email", { required: "Email is required !!!" })}
                />
                {errors?.email && (
                  <span className="text-red-600 text-sm">
                    {errors?.email?.message as string}
                  </span>
                )}
              </div>
              <div className="passwordContainer flex flex-col gap-y-1 ">
                <Label htmlFor="password">Your Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="  "
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
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime50 hover:bg-prime100  "
                }   `}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
            {/* form ends */}

            {/* <div className="forgotPassword  mt-2  font-semibold underline cursor-pointer text-blue-800 dark:text-blue-500  ">
              <Link to={"/forgotPassword"}>forgot password</Link>
            </div> */}

            {/*  */}

            <div className="text-center  mt-6  ">
              <a className="right-0 inline-block text-sm font-semibold align-baseline text-gray-900 hover:text-gray-950   ">
                Don't have any account ?{" "}
                <span className=" text-blue-700 font-bold cursor-pointer ">
                  <Link to={`/sign-up`}>Sign up </Link>
                </span>
              </a>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default Login;
