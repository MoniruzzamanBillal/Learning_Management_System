"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./schema/LoginSchema";

import ControlledInput from "@/components/input/ControlledInput";
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = usePost([[""]]);

  // * for login
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await loginMutation.mutateAsync({
        url: "/auth/login",
        payload: data,
      });

      console.log(result);

      if (result?.success) {
        toast.success("Logged in successfull!!!");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Login failed:", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="LoginContainer w-full min-h-screen  imageCenter flex items-center justify-center    ">
      <Wrapper className="formContainer py-14  ">
        <div className=" w-[95%] sc-500:w-[85%] sm:w-[78%] md:w-[70%] lg:w-[55%] m-auto p-3 sc-500:p-5 sm:p-7 md:p-10  rounded-md shadow-xl bg-gray-200  backdrop-blur bg-opacity-60 border border-gray-300   ">
          <p className=" mb-3 sc-500:mb-5 sm:mb-8 text-xl sc-500:text-2xl sm:text-3xl text-center font-semibold CormorantFont text-gray-800   ">
            Log in
          </p>
          {/*  */}

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className=" flex flex-col gap-y-4 "
            >
              <ControlledInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                className=" bg-slate-50 "
                isRequired
              />

              <ControlledInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter Password"
                className=" bg-slate-50 "
                isRequired
              />

              <Button
                disabled={loginMutation.isPending}
                className={`px-3 sc-500:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime-50 hover:bg-prime-100 cursor-pointer  ${
                  loginMutation.isPending
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime-50 hover:bg-prime-100  "
                }   `}
              >
                {loginMutation.isPending ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </Wrapper>
    </div>
  );
}
