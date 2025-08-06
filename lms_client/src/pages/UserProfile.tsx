import { UserProfileSkeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";

import { Link } from "react-router-dom";

import { format } from "date-fns";

import { Edit, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = () => {
  const { data: userData, isLoading: userDataLoading } =
    useGetLoggedInUserQuery(undefined, { refetchOnMountOrArgChange: true });

  console.log(userData?.data);

  let content = null;

  if (userDataLoading) {
    content = <UserProfileSkeleton />;
  }

  if (userData?.data) {
    content = (
      <div className="UserProfileContainer w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Photo Section */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gray-300 overflow-hidden">
          <img
            src={"https://i.postimg.cc/HLTCWBgC/pexels-scottwebb-1029604-1.jpg"}
            alt="Cover Photo"
            className="w-full h-full"
          />
        </div>

        <div className="container mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-32 relative z-10">
          <div className="flex flex-col items-center gap-4">
            {/* Profile Picture */}
            <div className="relative size-32 sm:size-40 md:size-48 rounded-full border-4 border-white bg-gray-200 shadow-lg overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={
                    userData?.data?.profilePicture ||
                    "/placeholder.svg?height=120&width=120&query=user profile"
                  }
                  alt={userData?.data?.name}
                />
                <AvatarFallback>
                  <User className="h-24 w-24 text-gray-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            {/* User Name - now centered below profile pic */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
              {userData?.data?.name}
            </h1>
          </div>

          {/* User Details and Edit Button */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <p className="text-lg font-medium text-gray-800 mb-2">
                  {userData?.data?.email}
                </p>
              </div>

              <Link
                to={`/dashboard/update-profile/${userData?.data?._id}`}
                className="mt-4 md:mt-0"
              >
                <Button className="bg-teal-600 hover:bg-teal-700 font-semibold text-sm sm:text-base">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit profile
                </Button>
              </Link>
            </div>
            <p className="text-sm font-semibold text-gray-600 border-t pt-4 mt-4">
              Joined On :{" "}
              {format(new Date(userData?.data?.createdAt), "dd-MMMM-yyyy")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="UserProfileContainer bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
      {content}
    </div>
  );
};

export default UserProfile;
