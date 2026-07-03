"use client";

import ControlledInput from "@/components/input/ControlledInput";
import { Button } from "@/components/ui/button";
import { authKey } from "@/constants/storageKey";
import { usePost } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoginFormData, loginSchema } from "./schema/LoginSchema";

export default function LoginPage() {
  const router = useRouter();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = usePost([[""]]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await loginMutation.mutateAsync({
        url: "/auth/login",
        payload: data,
      });

      if (result?.success) {
        Cookies.set(authKey, result.token, { expires: 1 });
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error: any) {
      toast.error((error as any)?.message ?? "Login failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xl font-bold mb-1">
            MATS <span className="text-prime-50">Academy</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <ControlledInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              className="bg-white border-gray-200"
              isRequired
            />

            <ControlledInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              className="bg-white border-gray-200"
              isRequired
            />

            <Button
              disabled={loginMutation.isPending}
              className="bg-prime-100 hover:bg-prime-200 text-white w-full font-semibold cursor-pointer mt-1"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </FormProvider>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-prime-100 hover:text-prime-200 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
