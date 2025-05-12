import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

const defaultImg =
  "https://i.postimg.cc/KjSd51G7/Screen-Shot-2019-03-30-at-1-ezgif-com-webp-to-jpg-converter.jpg";

const UserProfile = () => {
  return (
    <div className="UserProfileContainer">
      <div className="UserProfileWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <div className="profileImgWrapper flex flex-col xsm:flex-row justify-between items-center gap-y-8  ">
          {/* left section starts  */}
          <div className="profileLeftSection  flex  items-center gap-x-5 ">
            {/* left image section starts  */}
            <div className="imgSection rounded-full  overflow-auto size-[9rem]  ">
              <img src={defaultImg} className=" w-full h-full " alt="" />
            </div>
            {/* left image section ends */}

            {/* left name section starts  */}
            <div className="nameSection   ">
              <div className="nameTopSection flex items-center gap-x-2 mb-2 ">
                <p className=" text-xl sm:text-2xl font-semibold   ">
                  user name
                </p>
              </div>

              <p className=" text-sm font-medium text-gray-600 mb-2 ">
                user email
              </p>
            </div>
            {/* left name section ends  */}

            {/*  */}
          </div>
          {/* left section ends  */}

          {/* right section starts  */}
          <div className="profileRightSection  ">
            <Link to={`/dashboard/update-profile/userData?._id`}>
              <Button className=" bg-prime50 hover:bg-prime100  font-semibold text-sm sm:text-base  ">
                <FiEdit className="  " />
                Edit profile
              </Button>
            </Link>
          </div>
          {/* right section ends  */}

          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
