import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { TUserEnrolledCourse } from "./type";

const MyCourseCard = ({ courseData }: { courseData: TUserEnrolledCourse }) => {
  // console.log(courseData);

  return (
    <div className="enrolledCourseCard">
      <div className="enrolledCourseCardWrapper w-full xmd:w-[90%] lg:w-[75%] rounded-md shadow bg-white border border-gray-200 flex justify-between gap-x-5  ">
        {/* left course cover section  */}
        <div className="courseLeftCover w-[40%] h-[10rem] xsm:h-[12rem] sm:h-[13rem] rounded-l-md overflow-auto ">
          <Image
            src={courseData?.course?.courseCover}
            height={1280}
            width={1280}
            className=" w-full h-full "
            alt={courseData?.course?.name}
          />
        </div>
        {/*  */}

        {/* course detail section  */}
        <div className="detailSection rightSection py-2 w-[60%] flex flex-col gap-y-3  pr-3  ">
          {/* courseName */}
          <p className=" text-sm sc-500:text-lg sm:text-xl md:text-2xl font-medium ">
            {courseData?.course?.name}
          </p>
          {/* platform name  */}
          <p className=" text-xs sc-500:text-sm sm:text-base md:text-lg ">
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

          <Link href={`/my-courses/${courseData?.course?._id}`}>
            <Button className=" bg-prime-100 hover:bg-prime-200 cursor-pointer ">
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
