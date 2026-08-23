"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import FormSubmitLoading from "@/components/shared/FormSubmitLoading";
import { Button } from "@/components/ui/button";
import { updateProfileFunction } from "@/components/main/Profile/functions/profile.functions";
import { updateProfileSchema } from "@/components/main/Profile/schema/Profile.schemas";
import { TuserProfile } from "@/components/main/Profile/type/Profile.type";
import { useFetchData, usePatch } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type TUpdateProfileForm = z.infer<typeof updateProfileSchema>;

const UpdateProfile = () => {
  const router = useRouter();

  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TUpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
  });

  const { mutateAsync: updateProfile, isPending: profileUpdatingLoading } =
    usePatch([["user-date"]]);

  const { data: userDataRes, isLoading: userDataLoading } =
    useFetchData<TuserProfile>(["user-date"], "/user/loggedIn-user");

  const userData = userDataRes?.data;

  const avatarPreview = newImagePreview ?? userData?.profilePicture ?? null;

  const changeImagePreviewUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e?.target?.files?.[0];
    if (imageFile) {
      const previewUrl = URL.createObjectURL(imageFile);
      setNewImagePreview(previewUrl);
    } else {
      setNewImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setNewImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleNavigate = () => {
    router.push("/dashboard/profile");
  };

  const handleUpdateProfile = async (data: TUpdateProfileForm) => {
    const payload = {
      name: data?.name,
    };

    const formData = new FormData();

    const imageFile = data?.image?.[0];

    if (imageFile) {
      formData.append("profileImg", imageFile);
    }

    formData.append("data", JSON.stringify(payload));

    await updateProfileFunction(formData, updateProfile, handleNavigate);
  };

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.name,
      });
    }
  }, [userData, reset]);

  return (
    <>
      {(profileUpdatingLoading || userDataLoading) && <FormSubmitLoading />}

      <div className="UpdateProfileContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md">
        <div className="UpdateProfileWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Profile
          </h1>

          <div className="updateProfileForm p-1 w-[98%] xsm:w-[92%] m-auto">
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="flex flex-col gap-y-4"
            >
              <div className="emailContainer flex flex-col gap-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={userData?.email ?? ""} disabled />
              </div>

              <div className="nameContainer flex flex-col gap-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Your Name"
                  {...register("name", {
                    required: "Name is required !!!",
                  })}
                />
                {errors?.name && (
                  <span className="text-red-600 text-sm">
                    {errors?.name?.message as string}
                  </span>
                )}
              </div>

              <div className="imageContainer flex flex-col gap-y-1">
                <Label htmlFor="image">Profile Picture</Label>
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

                {avatarPreview && (
                  <div className="relative mt-2 w-fit">
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border"
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
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base active:scale-95 duration-500 bg-prime-50 hover:bg-prime-100 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-prime-50 hover:bg-prime-100"
                }`}
              >
                {isSubmitting ? "Updating Profile..." : "Update Profile"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
