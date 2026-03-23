import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { TCourse, TInstructor, TReview } from "./Course.type";

type TCourseDataProps = {
  course: TCourse;
};

const CourseCard = ({ course }: TCourseDataProps) => {
  // console.log(course?.reviewData);

  return (
    <div className="CourseCardContainer   m-auto sm:m-0 w-[92%] sc-500:w-[70%] sm:w-full bg-gray-50 border border-gray-300 shadow rounded  ">
      <div className="CourseCardWrapper   flex flex-col  gap-y-1 ">
        {/* course cover section  */}
        <div className="courseCover h-52 rounded-t overflow-auto relative ">
          <Image
            height={1280}
            width={1280}
            src={course?.courseCover}
            className=" w-full h-full "
            alt="course_cover"
          />

          <span className="  courseLabel absolute top-0 left-0 bg-prime-50 text-gray-50 text-xs py-1 px-2 rounded font-medium ">
            Beginner
          </span>
        </div>

        <div className="courseDetailBody px-3 flex flex-col justify-between h-64 ">
          {/* course name  */}
          <p className=" courseName  font-bold "> {course?.name} </p>

          {/* course category  */}
          <p className=" courseCategory  ">
            <span className=" font-semibold text-sm ">Category : </span>

            {course?.category}
          </p>

          {/* course instructors  */}
          <div className="courseInstructors">
            <p className=" font-semibold text-sm ">Instructors : </p>
            <ul className=" list-inside list-disc text-xs ">
              {course?.instructors &&
                course?.instructors?.map((indtructor: TInstructor) => (
                  <li
                    key={indtructor?._id}
                    className=" pl-3 font-medium text-prime-100 "
                  >
                    {indtructor?.name}
                  </li>
                ))}
            </ul>
          </div>

          {/* review star section  */}
          <div className="reviewStarSection flex items-center  ">
            {renderStars(course?.reviewData)}
            <span className=" pl-1 ">
              (
              {course?.reviewData?.totalReviews
                ? course?.reviewData?.totalReviews
                : 0}
              )
            </span>
          </div>

          {/* button section  */}
          <div className="bottomSection py-3 flex justify-between items-center ">
            {/* course price  */}
            <p className=" coursePrice  text-prime-200 font-bold ">
              Price : ${course?.price}
            </p>

            {/* button  */}
            <div className="btn ">
              <Link href={`/courses/${course?._id}`}>
                <Button
                  size={"sm"}
                  className=" bg-prime-100 hover:bg-prime-200 text-sm "
                >
                  See Details
                </Button>
              </Link>
            </div>

            {/*  */}
          </div>

          {/*  */}
        </div>

        {/*  */}
      </div>
    </div>
  );
};

const renderStars = (reviewData?: TReview) => {
  const totalLength = 5;

  const filledStars = Math.floor(reviewData?.averageRating || 0);

  return Array.from({ length: totalLength }, (_, index) => (
    <FaStar
      key={index}
      className={`  ${
        index < filledStars ? "text-orange-400" : "text-gray-400"
      }`}
    />
  ));
};

export default CourseCard;
