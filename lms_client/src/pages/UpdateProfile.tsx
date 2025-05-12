import { FormSubmitLoading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetSingleUserQuery } from "@/redux/features/user/user.api";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { userId } = useParams();

  const navigate = useNavigate();

  if (!userId) {
    throw new Error("Something went wrong !!!");
  }

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: userData, isLoading } = useGetSingleUserQuery(userId, {
    skip: !userId,
  });

  console.log(userData?.data);

  const {
    register,
    handleSubmit,

    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleNavigate = () => {
    navigate(-1);
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

  // ! for removing a image after select image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef?.current) {
      imageInputRef.current.value = "";
    }
  };

  //   ! for updating profile
  const handleUpdateProfile = async (data) => {
    console.log("update profile !!!!");
    console.log(data);
  };

  // ! useeffect for handling default value
  //  useEffect(() => {
  //     if (moduleData?.data) {
  //       const module = moduleData.data;

  //       reset({
  //         course: module?.course?._id,
  //         title: module?.title,
  //       });
  //     }
  //   }, [moduleData?.data, reset]);

  return (
    <>
      {isLoading && <FormSubmitLoading />}

      <div className="UpdateProfileContainer py-8 bg-gray-100 border border-gray-300 p-3 shadow rounded-md  ">
        <div className="UpdateProfileWrapper">
          <h1 className="mb-8 px-3 xsm:px-4 sm:px-5 md:px-6 font-bold text-2xl md:text-3xl text-center">
            Update Profile
          </h1>

          <div className="updateModuleForm p-1 w-[98%] xsm:w-[92%] sm:w-[85%] md:w-[80%] xmd:w-[75%] lg:w-[65%] m-auto">
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className=" flex flex-col gap-y-4 "
            >
              {/* user name  */}
              <div className="nameContainer flex flex-col gap-y-1.5">
                <Label htmlFor="name">User Name </Label>

                <Input
                  id="name"
                  type="text"
                  className="  "
                  placeholder="Enter User name "
                  {...register("name", {
                    required: "User name is required !!!",
                  })}
                />

                {errors?.name && (
                  <span className="text-red-600 text-sm">
                    {errors?.name?.message as string}
                  </span>
                )}
              </div>

              {/* user profile image   */}
              <div className="profileContainer flex flex-col gap-y-1.5">
                <Label htmlFor="image">User Profile Image </Label>
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
                className={`px-3 xsm:px-4 sm:px-5 md:px-6 font-semibold text-xs sm:text-sm md:text-base  active:scale-95 duration-500  bg-prime50 hover:bg-prime100 ${
                  isSubmitting
                    ? " cursor-not-allowed bg-gray-600 "
                    : "bg-prime50 hover:bg-prime100  "
                }   `}
              >
                {isSubmitting ? "Updating Profile..." : "Update Profile "}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
