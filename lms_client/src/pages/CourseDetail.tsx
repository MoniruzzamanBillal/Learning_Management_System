import Wrapper from "@/components/shared/Wrapper";
import {
  CourseDetailSkeleton,
  CourseDetailTop,
  ReviewInput,
} from "@/components/ui/courseDetail.tsx";
import { useGetCouseDetailQuery } from "@/redux/features/course/course.api";
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

  // console.log(courseDetail?.data?.description);

  // ! for adding review
  const handleAddReview = async () => {
    console.log("review added !!!!");
  };

  return (
    <>
      {isLoading && <CourseDetailSkeleton />}

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
          <Wrapper className="reviewSection mt-8 ">
            <h1 className="   font-semibold text-2xl mb-3 mt-6 underline ">
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
          </Wrapper>

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
