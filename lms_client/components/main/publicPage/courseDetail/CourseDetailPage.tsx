"use client";

import Wrapper from "@/components/shared/Wrapper";
import { useFetchData, usePost } from "@/hooks/useApi";
import { useGetUser } from "@/hooks/useGetUser";
import { TApiResponse } from "@/types/globalTypes";
import { useState } from "react";
import { toast } from "sonner";
import { TCourse } from "../course/Course.type";
import CourseDetailSkeleton from "./CourseDetailSkeleton";
import CourseDetailTop from "./CourseDetailTop";
import ReviewInput from "./ReviewInput";
import UserReviewCard, { TPopulatedReview } from "./UserReviewCard";

export default function CourseDetailPage({ id }: { id: string }) {
  const userData = useGetUser();

  const [review, setReview] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  const { data: courseDetail, isLoading } = useFetchData<TApiResponse<TCourse>>(
    [`course-detail-${id}`, `course-${id}`],
    `/course/course-detail/${id}`,
    {
      enabled: !!id,
    },
  );

  const { data: checkEnrolledData } = useFetchData<
    TApiResponse<{
      enrolledIncourse: boolean;
    }>
  >(
    [`user-enroll-course-${id}`],
    `/enroll/check-user-enrolled?courseId=${id}&userId=${userData?.userId || ""}`,
    {
      enabled: !!id && !!userData?.userId,
    },
  );

  // console.log("checkEnrolledData = ", checkEnrolledData);

  const {
    data: courseReview,
    isLoading: courseReviewLoading,
    refetch: reviewDataRefetch,
  } = useFetchData<TApiResponse<TPopulatedReview[]>>(
    [`course-review-${id}`],
    `/review/course-review/${id}`,
    {
      enabled: !!id,
    },
  );

  // console.log("courseReview = ", courseReview);

  const {
    data: reviewEligibility,
    isLoading: reviewEligibleDataLoading,
    refetch: eligibilityRefetch,
  } = useFetchData<TApiResponse<boolean | null>>(
    [`review-eligibility-${id}`],
    `/review/check-review-eligibility?courseId=${id}&userId=${userData?.userId || ""}`,
    {
      enabled: !!id && !!userData?.userId,
    },
  );

  // console.log("reviewEligibility = ", reviewEligibility);

  const { mutateAsync: giveReview, isPending: reviewGivingPending } = usePost([
    [`course-${id}`],
    [`course-detail-${id}`],
    [`course-review-${id}`],
    [`review-eligibility-${id}`],
  ]);

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
      userId: userData?.userId,
      courseId: id,
      rating,
      comment: review,
    };

    console.log("review payload = ", payload);

    const result = await giveReview({
      url: `/review/give-review`,
      payload,
    });
    console.log(result);

    // if (result?.data?.success) {
    //   reviewDataRefetch();
    //   eligibilityRefetch();
    // }
  };

  let content = null;

  if (isLoading || reviewEligibleDataLoading || courseReviewLoading) {
    content = <CourseDetailSkeleton />;
  } else {
    content = (
      <div className="CourseDetailWrapper">
        {/* course detail top name section  */}
        {courseDetail?.data && (
          <CourseDetailTop
            alreadyEnrolled={checkEnrolledData?.data?.enrolledIncourse ?? false}
            courseDetails={courseDetail?.data}
            userInfo={userData ?? undefined}
          />
        )}

        {/* course detail section  */}
        <Wrapper className=" courseDetail my-5 ">
          <div
            className="  courseDetail "
            dangerouslySetInnerHTML={{
              __html: courseDetail?.data?.description as string,
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
                  reviewGivingLoading={reviewGivingPending}
                />
              </div>
            )}

            {courseReview?.data?.length === 0 && (
              <p className=" py-4 text-xl  font-semibold text-prime-100 ">
                No Review Available for this course{" "}
              </p>
            )}

            {/* review card section  */}
            <div className="userReviewCard">
              {courseReview?.data &&
                courseReview?.data?.map((reviewData: TPopulatedReview) => (
                  <UserReviewCard
                    key={reviewData?._id}
                    reviewData={reviewData}
                    reviewDataRefetch={reviewDataRefetch}
                  />
                ))}
            </div>
          </Wrapper>
        </div>

        {/*  */}
      </div>
    );
  }

  return (
    <div className="CourseDetailContainer bg-gray-50 min-h-screen  ">
      {content}
    </div>
  );
}
