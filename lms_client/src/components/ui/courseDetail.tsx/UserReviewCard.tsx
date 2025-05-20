/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateReviewFunction } from "@/functions/review.function";
import { useUpdateReviewMutation } from "@/redux/features/review/review.api";
import { useGetUser } from "@/utils/sharedFunction";
import { format } from "date-fns";
import { useState } from "react";

import { FaStar } from "react-icons/fa";
import { toast } from "sonner";

export type TPopulatedReview = {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    profilePicture: string;
  };
};

type Tprops = {
  reviewData: TPopulatedReview;
  reviewDataRefetch: any;
};

const UserReviewCard = ({ reviewData, reviewDataRefetch }: Tprops) => {
  const userInfo = useGetUser();

  // console.log(reviewData);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reviewData?.comment);

  const [rating, setRating] = useState(reviewData?.rating);

  const [updateReview] = useUpdateReviewMutation();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // ! for canceling updadteing edit
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(reviewData?.comment);
    setRating(reviewData?.rating);
  };

  // ! for updating comment
  const handleSaveClick = async () => {
    if (!editedContent) {
      toast.error("Give a meaningfull review  ");
      return;
    }
    if (rating === 0) {
      toast.error("Give a star  ");
      return;
    }

    const payload = {
      reviewId: reviewData?._id,
      comment: editedContent,
      rating,
    };

    console.log("save review ");
    console.log(payload);

    const result = await updateReviewFunction(payload, updateReview);

    console.log(result?.data?.data);

    if (result?.data?.data) {
      reviewDataRefetch();
      setIsEditing(false);
    }
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
              src={reviewData?.userId?.profilePicture}
              alt={reviewData?.userId?.name}
            />
          </div>
          {/* writer image  */}

          {/* writer name  */}

          <div className="writerName   ">
            <p className=" text-gray-900 font-semibold text-xs sm:text-sm ">
              {reviewData?.userId?.name}
            </p>
            <p className=" text-gray-600 font-medium text-xs  ">
              {format(
                new Date(reviewData?.createdAt as string),
                "dd-MMMM-yyyy"
              )}
            </p>
          </div>
        </div>

        {/* review star starts  */}
        {!isEditing && (
          <div className="reviewStar paragraphFont text-sm sm:text-base mb-2 flex gap-x-.5 ">
            {renderStars(reviewData)}
          </div>
        )}

        {/* User comment */}
        <div className="userComment paragraphFont text-sm sm:text-base mb-2   ">
          {isEditing ? (
            <div>
              <textarea
                className="  border border-gray-300 rounded-md p-1  w-[40%] "
                id="comment"
                rows={4}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              ></textarea>

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
            <p> {reviewData?.comment} </p>
          )}
        </div>

        {/* Edit delete button section */}

        {userInfo?.userId === reviewData?.userId?._id && (
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
        )}

        {/*  */}
      </div>
    </div>
  );
};

//   ! fucntion for rendering star
const renderStars = (reviewData: TPopulatedReview) => {
  const totalLength = 5;

  const filledStars = reviewData?.rating || 0;

  return Array.from({ length: totalLength }, (_, index) => (
    <FaStar
      key={index}
      className={`  ${
        index < filledStars ? "text-orange-400" : "text-gray-400"
      }`}
    />
  ));
};

export default UserReviewCard;
