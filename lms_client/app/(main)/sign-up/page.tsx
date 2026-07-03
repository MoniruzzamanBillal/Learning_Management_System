"use client";

import ControlledInput from "@/components/input/ControlledInput";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ message: "Email is required" })
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const registerMutation = usePost([[""]]);

  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const result = await registerMutation.mutateAsync({
        url: "/auth/register",
        payload: data,
      });

      if (result?.success) {
        toast.success("Account created! Please log in.");
        router.push("/login");
      } else {
        toast.error(result?.message ?? "Registration failed");
      }
    } catch (error: any) {
      toast.error((error as any)?.message ?? "Something went wrong");
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">
            Join thousands of learners today
          </p>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <ControlledInput
              name="name"
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              className="bg-white border-gray-200"
              isRequired
            />

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
              placeholder="At least 6 characters"
              className="bg-white border-gray-200"
              isRequired
            />

            <Button
              disabled={registerMutation.isPending}
              className="bg-prime-100 hover:bg-prime-200 text-white w-full font-semibold cursor-pointer mt-1"
            >
              {registerMutation.isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </FormProvider>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-prime-100 hover:text-prime-200 font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
