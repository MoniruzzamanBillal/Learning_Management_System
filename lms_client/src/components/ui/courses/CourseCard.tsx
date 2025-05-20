import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button } from "../button";

type TInstructor = {
  _id: string;
  name: string;
};

export type TCourse = {
  _id: string;
  name: string;
  category: string;
  courseCover: string;
  instructors: TInstructor[];
  price: number;
};

type TCourseDataProps = {
  course: TCourse;
};

const CourseCard = ({ course }: TCourseDataProps) => {
  // console.log(course?.instructors);

  return (
    <div className="CourseCardContainer bg-gray-50 border border-gray-300 shadow rounded  ">
      <div className="CourseCardWrapper   flex flex-col  gap-y-1 ">
        {/* course cover section  */}
        <div className="courseCover h-[13rem] rounded-t overflow-auto relative ">
          <img
            src={course?.courseCover}
            className=" w-full h-full "
            alt="course_cover"
          />

          <span className="  courseLabel absolute top-0 left-0 bg-prime50 text-gray-50 text-xs py-1 px-2 rounded font-medium ">
            Beginner
          </span>
        </div>

        <div className="courseDetailBody px-3 flex flex-col justify-between h-[15rem] ">
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
                  <li className=" pl-3 font-medium text-prime100 ">
                    {indtructor?.name}
                  </li>
                ))}
            </ul>
          </div>

          {/* review star section  */}
          <div className="reviewStarSection pt-2 flex items-center  ">
            {renderStars()}
            <span className=" pl-1 ">(5)</span>
          </div>

          {/* button section  */}
          <div className="bottomSection py-3 flex justify-between items-center ">
            {/* course price  */}
            <p className=" coursePrice  text-prime200 font-semibold text-sm ">
              Price : ${course?.price}
            </p>

            {/* button  */}
            <div className="btn ">
              <Link to={`/course-detail/${course?._id}`}>
                <Button className=" bg-prime100 hover:bg-prime200 text-sm ">
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

const renderStars = () => {
  const totalLength = 5;

  // const filledStars = reviewData?.rating || 0;
  const filledStars = 3;

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
