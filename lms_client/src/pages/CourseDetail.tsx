import Wrapper from "@/components/shared/Wrapper";
import {
  CourseDetailSkeleton,
  CourseDetailTop,
  ReviewInput,
  UserReviewCard,
} from "@/components/ui/courseDetail.tsx";
import { TPopulatedReview } from "@/components/ui/courseDetail.tsx/UserReviewCard";
import { useGetCouseDetailQuery } from "@/redux/features/course/course.api";
import {
  useCheckReviewEligibilityQuery,
  useGetCourseReviewQuery,
} from "@/redux/features/review/review.api";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();

  // console.log("course id = ", courseId);

  const [review, setReview] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

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

  const { data: reviewEligibility, isLoading: reviewEligibleDataLoading } =
    useCheckReviewEligibilityQuery(courseId, {
      skip: !courseId,
    });

  // console.log(courseDetail?.data);
  // console.log(reviewEligibility?.data);
  // console.log(courseReview?.data);

  // ! for adding review
  const handleAddReview = async () => {
    console.log("review added !!!!");
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
                Comments :{" "}
              </h1>

              {/* review button section  */}
              <div className="reviewInputSection">
                <ReviewInput
                  review={review}
                  setReview={setReview}
                  handleAddReview={handleAddReview}
                  rating={rating}
                  setRating={setRating}
                />
              </div>

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
