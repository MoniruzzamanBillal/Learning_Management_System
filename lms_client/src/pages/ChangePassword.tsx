import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

const ChangePassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TChangePassword>();

  //   ! for changing password
  const handleChangePassword = async (data: TChangePassword) => {
    const toastId = toast.loading("Changing password...");
  };

  return (
    <>
      {/* {isLoading && <FormSubmitLoading />} */}

      <div className="ChangePasswordContainer w-full min-h-screen flex items-center justify-center">
        <Wrapper className="formContainer py-14">
          <div className="w-[95%] xsm:w-[85%] sm:w-[78%] md:w-[70%] xmd:w-[65%] lg:w-[55%] m-auto p-3 xsm:p-5 sm:p-7 md:p-10 rounded-md shadow-xl bg-gray-200 backdrop-blur bg-opacity-60 border">
            <p className="text-xl xsm:text-2xl sm:text-3xl text-center font-semibold text-gray-700 mb-6">
              Change Your Password
            </p>

            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="flex flex-col gap-y-4"
            >
              <div className="flex flex-col gap-y-1">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Enter current password"
                  {...register("oldPassword", {
                    required: "Old password is required",
                  })}
                />
                {errors.oldPassword && (
                  <span className="text-red-600 text-sm">
                    {errors.oldPassword.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                />
                {errors.newPassword && (
                  <span className="text-red-600 text-sm">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              <Button
                disabled={isSubmitting}
                className={`px-5 py-2 font-semibold text-sm sm:text-base duration-500 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-prime50 hover:bg-prime100"
                }`}
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default ChangePassword;
