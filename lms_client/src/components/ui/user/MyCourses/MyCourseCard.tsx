import { TUserEnrolledCourse } from "@/pages/user/MyCourses";
import { Link } from "react-router-dom";
import { Button } from "../../button";
import { Progress } from "../../progress";

const MyCourseCard = ({ courseData }: { courseData: TUserEnrolledCourse }) => {
  // console.log(courseData);

  return (
    <div className="enrolledCourseCard">
      <div className="enrolledCourseCardWrapper w-full xmd:w-[90%] lg:w-[75%] rounded-md shadow bg-white border border-gray-200 flex justify-between gap-x-5  ">
        {/* left course cover section  */}
        <div className="courseLeftCover w-[40%] h-[10rem] xsm:h-[12rem] sm:h-[13rem] rounded-l-md overflow-auto ">
          <img
            src={courseData?.course?.courseCover}
            className=" w-full h-full "
            alt={courseData?.course?.name}
          />
        </div>
        {/*  */}

        {/* course detail section  */}
        <div className="detailSection rightSection py-2 w-[60%] flex flex-col gap-y-3  pr-3  ">
          {/* courseName */}
          <p className=" text-sm xsm:text-lg sm:text-xl md:text-2xl font-medium ">
            {courseData?.course?.name}
          </p>
          {/* platform name  */}
          <p className=" text-xs xsm:text-sm sm:text-base md:text-lg ">
            MATS academy{" "}
          </p>

          {/* course progress section  */}
          <div className="courseProgressSection sm:w-[95%] md:w-[90%] flex justify-center items-center gap-x-6  ">
            <Progress value={courseData?.courseProgress} className="  " />
            <p className=" text-xs xsm:text-sm sm:text-base md:text-lg font-medium ">
              {courseData?.courseProgress}%
            </p>
          </div>

          {/* button section  */}

          <Link to={`/my-enrolled-course-detail/${courseData?.course?._id}`}>
            <Button className=" bg-prime100 hover:bg-prime200  ">
              Continue
            </Button>
          </Link>
        </div>

        {/*  */}
      </div>

      {/*  */}
    </div>
  );
};

export default MyCourseCard;
