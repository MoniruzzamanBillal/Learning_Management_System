import Wrapper from "@/components/shared/Wrapper";
import {
  CourseDetailSkeleton,
  CourseDetailTop,
} from "@/components/ui/courseDetail.tsx";
import { useGetCouseDetailQuery } from "@/redux/features/course/course.api";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();

  // console.log("course id = ", courseId);

  const { data: courseDetail, isLoading } = useGetCouseDetailQuery(courseId, {
    skip: !courseId,
  });

  // console.log(courseDetail?.data?.description);

  return (
    <>
      {isLoading && <CourseDetailSkeleton />}

      <div className="CourseDetailContainer bg-gray-50 min-h-screen  ">
        <div className="CourseDetailWrapper">
          {/* course detail top name section  */}
          <CourseDetailTop courseDetails={courseDetail?.data} />

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

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
