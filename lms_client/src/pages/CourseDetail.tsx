import Wrapper from "@/components/shared/Wrapper";
import {
  CourseDetailSkeleton,
  CourseDetailTop,
  ReviewInput,
  UserReviewCard,
} from "@/components/ui/courseDetail.tsx";
import { TPopulatedReview } from "@/components/ui/courseDetail.tsx/UserReviewCard";
import { giveReviewFunction } from "@/functions/review.function";
import { useGetCouseDetailQuery } from "@/redux/features/course/course.api";
import {
  useCheckReviewEligibilityQuery,
  useGetCourseReviewQuery,
  useGiveReviewMutation,
} from "@/redux/features/review/review.api";
import { useGetUser } from "@/utils/sharedFunction";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseDetail = () => {
  const { courseId } = useParams();

  const userInfo = useGetUser();

  // console.log("course id = ", courseId);

  // console.log(userInfo?.userId);

  const [review, setReview] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  const [giveReview, { isLoading: reviewGivingLoading }] =
    useGiveReviewMutation();

  const { data: courseDetail, isLoading } = useGetCouseDetailQuery(courseId, {
    skip: !courseId,
  });

  const {
    data: courseReview,
    isLoading: courseReviewLoading,
    refetch: reviewDataRefetch,
  } = useGetCourseReviewQuery(courseId, {
    skip: !courseId,
  });

  const {
    data: reviewEligibility,
    isLoading: reviewEligibleDataLoading,
    refetch: eligibilityRefetch,
  } = useCheckReviewEligibilityQuery(courseId, {
    skip: !courseId,
  });

  // console.log(courseDetail?.data);
  // console.log(reviewEligibility?.data);
  // console.log(courseReview?.data);

  // console.log(userInfo);

  // ! for adding review
  const handleAddReview = async () => {
    if (!review) {
      toast.error("Give a meaningfull review  ");
      return;
    }
    if (rating === 0) {
      toast.error("Give a star  ");
      return;
    }

    const payload = {
      userId: userInfo?.userId,
      courseId: courseId,
      rating,
      comment: review,
    };

    const result = await giveReviewFunction(payload, giveReview);
    console.log(result?.data?.success);

    if (result?.data?.success) {
      reviewDataRefetch();
      eligibilityRefetch();
    }
  };

  return (
    <>
      {(isLoading || reviewEligibleDataLoading || courseReviewLoading) && (
        <CourseDetailSkeleton />
      )}

      <div className="CourseDetailContainer bg-gray-50 min-h-screen  ">
        <div className="CourseDetailWrapper">
          {/* course detail top name section  */}
          {courseDetail?.data && (
            <CourseDetailTop courseDetails={courseDetail?.data} />
          )}

          {/* course detail section  */}
          <Wrapper className=" courseDetail my-5 ">
            <h1>About this course : </h1>

            <div
              className="  courseDetail "
              dangerouslySetInnerHTML={{
                __html: courseDetail?.data?.description,
              }}
            ></div>
          </Wrapper>

          {/* review section  */}
          <div className="reviewContainer bg-gray-100 py-3 ">
            <Wrapper className="reviewSection  ">
              <h1 className="   font-semibold text-2xl py-5 underline ">
                Review :
              </h1>

              {/* review button section  */}
              {reviewEligibility?.data && (
                <div className="reviewInputSection">
                  <ReviewInput
                    review={review}
                    setReview={setReview}
                    handleAddReview={handleAddReview}
                    rating={rating}
                    setRating={setRating}
                    reviewGivingLoading={reviewGivingLoading}
                  />
                </div>
              )}

              {courseReview?.data?.length === 0 && (
                <p className=" py-4 text-xl  font-semibold text-prime100 ">
                  No Review Available for this course{" "}
                </p>
              )}

              {/* review card section  */}
              <div className="userReviewCard">
                {courseReview?.data &&
                  courseReview?.data?.map((reviewData: TPopulatedReview) => (
                    <UserReviewCard
                      reviewData={reviewData}
                      reviewDataRefetch={reviewDataRefetch}
                    />
                  ))}
              </div>
            </Wrapper>
          </div>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
