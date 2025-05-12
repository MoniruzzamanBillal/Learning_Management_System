import { UserProfileSkeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useGetLoggedInUserQuery } from "@/redux/features/user/user.api";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

import { format } from "date-fns";

const UserProfile = () => {
  const { data: userData, isLoading: userDataLoading } =
    useGetLoggedInUserQuery(undefined, { refetchOnMountOrArgChange: true });

  // console.log(userData?.data);

  return (
    <>
      {userDataLoading && <UserProfileSkeleton />}

      {userData?.data && (
        <div className="UserProfileContainer">
          <div className="UserProfileWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
            <div className="profileImgWrapper flex flex-col xsm:flex-row justify-between items-center gap-y-8  ">
              {/* left section starts  */}
              <div className="profileLeftSection  flex  items-center gap-x-5 ">
                {/* left image section starts  */}
                <div className="imgSection rounded-full  overflow-auto size-[9rem]  ">
                  <img
                    src={userData?.data?.profilePicture}
                    className=" w-full h-full "
                    alt=""
                  />
                </div>
                {/* left image section ends */}

                {/* left name section starts  */}
                <div className="nameSection   ">
                  <div className="nameTopSection flex items-center gap-x-2 mb-2 ">
                    <p className=" text-xl sm:text-2xl font-semibold   ">
                      {userData?.data?.name}
                    </p>
                  </div>

                  <p className=" text-sm font-medium text-gray-600 mb-2 ">
                    {userData?.data?.email}
                  </p>
                </div>
                {/* left name section ends  */}

                {/*  */}
              </div>
              {/* left section ends  */}

              {/* right section starts  */}
              <div className="profileRightSection  ">
                <Link to={`/dashboard/update-profile/${userData?.data?._id}`}>
                  <Button className=" bg-prime50 hover:bg-prime100  font-semibold text-sm sm:text-base  ">
                    <FiEdit className="  " />
                    Edit profile
                  </Button>
                </Link>
              </div>
              {/* right section ends  */}

              {/*  */}
            </div>

            <p className=" mt-4 p-3 text-lg font-semibold  ">
              Joined On :{" "}
              {format(new Date(userData?.data?.createdAt), "dd-MMMM-yyyy")}{" "}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
