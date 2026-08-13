import { format } from "date-fns";
import Image from "next/image";
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
  reviewDataRefetch: () => void;
};

const UserReviewCard = ({ reviewData, reviewDataRefetch }: Tprops) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reviewData?.comment);
  const [rating, setRating] = useState(reviewData?.rating);

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(reviewData?.comment);
    setRating(reviewData?.rating);
  };

  const handleSaveClick = async () => {
    if (!editedContent) {
      toast.error("Give a meaningful review");
      return;
    }
    if (rating === 0) {
      toast.error("Give a star rating");
      return;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 my-3">
      {/* Author info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="size-10 rounded-full overflow-hidden border-2 border-indigo-100 shrink-0">
          <Image
            className="w-full h-full object-cover"
            width={80}
            height={80}
            src={reviewData?.userId?.profilePicture}
            alt={reviewData?.userId?.name}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {reviewData?.userId?.name}
          </p>
          <p className="text-gray-400 text-xs">
            {format(new Date(reviewData?.createdAt), "dd MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* Stars */}
      {!isEditing && (
        <div className="flex gap-0.5 mb-2">
          {renderStars(reviewData)}
        </div>
      )}

      {/* Comment */}
      <div className="text-sm text-gray-700">
        {isEditing ? (
          <div>
            <textarea
              className="border border-gray-200 rounded-lg p-2 w-full text-sm bg-gray-50"
              rows={4}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="leading-relaxed">{reviewData?.comment}</p>
        )}
      </div>
    </div>
  );
};

const renderStars = (reviewData: TPopulatedReview) => {
  return Array.from({ length: 5 }, (_, index) => (
    <FaStar
      key={index}
      className={index < reviewData?.rating ? "text-orange-400" : "text-gray-300"}
      size={14}
    />
  ));
};

export default UserReviewCard;
