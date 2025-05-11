import { Button } from "../button";

type TProps = {
  review: string | null;
  rating: number;
  reviewGivingLoading: boolean;
  setRating: (value: number) => void;
  setReview: (value: string) => void;
  handleAddReview: () => void;
};

const ReviewInput = ({
  review,
  setReview,
  handleAddReview,
  rating,
  setRating,
  reviewGivingLoading,
}: TProps) => {
  return (
    <div className="ReviewInputContainer  ">
      <div className="ReviewInputWrapper w-full mb-4 border border-gray-300  rounded-md bg-gray-50 shadow ">
        <div className="px-4 py-2   ">
          <label htmlFor="review" className="sr-only">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={5}
            value={review as string}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-0 text-sm bg-gray-50  border-none outline-none  "
            required
            placeholder="Give Your Review..."
          ></textarea>
        </div>

        {/* Rating Section */}
        <div className="px-4 py-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
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

        {/* button  */}
        <div className="flex items-center justify-between px-3 py-2 border-t  ">
          <Button
            disabled={reviewGivingLoading}
            type="submit"
            onClick={() => handleAddReview()}
            className=" text-sm font-medium  text-white bg-prime100 hover:bg-prime200 rounded-md   "
          >
            {reviewGivingLoading ? "Giving Review " : "Give Review "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewInput;
