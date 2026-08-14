import { Button } from "@/components/ui/button";

type TProps = {
  review: string | null;
  rating: number;
  reviewGivingLoading?: boolean;
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
  reviewGivingLoading = false,
}: TProps) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Textarea */}
        <div className="px-4 py-3">
          <label htmlFor="review" className="sr-only">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            value={review as string}
            onChange={(e) => setReview(e.target.value)}
            className="w-full text-sm text-gray-700 bg-white border-none outline-none resize-none placeholder:text-gray-400"
            required
            placeholder="Share your experience with this course..."
          />
        </div>

        {/* Stars */}
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-2">
            Your rating
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  rating >= star ? "text-yellow-400" : "text-gray-200"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end px-4 py-3 border-t border-gray-100 bg-gray-50">
          <Button
            disabled={reviewGivingLoading}
            type="submit"
            onClick={handleAddReview}
            className="bg-prime-100 hover:bg-prime-200 text-white text-sm cursor-pointer"
          >
            {reviewGivingLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewInput;
