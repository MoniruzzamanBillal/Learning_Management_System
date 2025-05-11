import { useGetUser } from "@/utils/sharedFunction";
import { format } from "date-fns";
import { useState } from "react";

import { FaStar } from "react-icons/fa";

const UserReviewCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  //   const [editedContent, setEditedContent] = useState(review?.comment);
  const [editedContent, setEditedContent] = useState("");
  const [rating, setRating] = useState(0);

  const userInfo = useGetUser();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // ! for canceling updadteing edit
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent("");
    // setEditedContent(review?.comment);
    setRating(0);
  };

  // ! for updating comment
  const handleSaveClick = async () => {
    // const payload = { reviewId: review?._id, comment: editedContent, rating };

    console.log("save review ");
  };

  return (
    <div className="UserReviewCardContainer">
      <div className="UserReviewCardWrapper  my-3 p-3 rounded-md bg-gray-50 border border-gray-300  ">
        {/* writer info   */}
        <div className="writerInfo  flex items-center gap-3 mb-3  ">
          {/* writer image  */}
          <div className="writerImg   ">
            <img
              className=" w-8 h-8 xsm:w-9 xsm:h-9 sm:w-10 sm:h-10 rounded-full"
              src={"https://i.postimg.cc/Wbc4RGDZ/images.jpg"}
              alt="user avatar"
            />
          </div>
          {/* writer image  */}

          {/* writer name  */}

          <div className="writerName   ">
            <p className=" text-gray-900 font-semibold text-xs sm:text-sm ">
              user name
            </p>
            <p className=" text-gray-600 font-medium text-xs  ">
              {format(new Date(2014, 1, 11), "dd-MMMM-yyyy")}
            </p>
          </div>
        </div>

        {/* review star starts  */}
        {!isEditing && (
          <div className="reviewStar paragraphFont text-sm sm:text-base mb-2 flex gap-x-.5 ">
            {renderStars()}
          </div>
        )}

        {/* User comment */}
        <div className="userComment paragraphFont text-sm sm:text-base mb-2 ">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="  border border-gray-300 rounded-md p-1  "
              />

              {/* Rating Section */}
              <div className=" pt-3">
                <label className="block text-sm font-medium text-gray-700">
                  Rating (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p> user review data </p>
          )}
        </div>

        {/* Edit delete button section */}

        <div className="mt-4 editDeleteBtn text-xs flex items-center gap-x-4">
          {isEditing ? (
            <>
              <p
                className="underline text-green-600 font-semibold cursor-pointer"
                onClick={handleSaveClick}
              >
                Save
              </p>
              <p
                className="underline text-red-600 font-semibold cursor-pointer"
                onClick={handleCancelClick}
              >
                Cancel
              </p>
            </>
          ) : (
            <>
              <p
                className="underline text-green-600 font-semibold cursor-pointer"
                onClick={handleEditClick}
              >
                Edit
              </p>
            </>
          )}
        </div>

        {/*  */}
      </div>
    </div>
  );
};

//   ! fucntion for rendering star
const renderStars = () => {
  const totalLength = 5;
  const filledStars = 3;
  // const filledStars = review?.rating || 0;

  return Array.from({ length: totalLength }, (_, index) => (
    <FaStar
      key={index}
      className={`  ${
        index < filledStars ? "text-orange-400" : "text-gray-500"
      }`}
    />
  ));
};

export default UserReviewCard;
