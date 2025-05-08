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
      <div className="CourseCardWrapper   flex flex-col  gap-y-2 ">
        {/* course cover section  */}
        <div className="courseCover h-[14rem] rounded-t overflow-auto relative ">
          <img
            src={course?.courseCover}
            className=" w-full h-full "
            alt="course_cover"
          />

          <span className="  courseLabel absolute top-0 left-0 bg-prime50 text-gray-50 text-xs py-1 px-2 rounded font-medium ">
            Beginner
          </span>
        </div>

        <div className="courseDetailBody px-3 flex flex-col justify-between gap-y-2 h-[15rem] ">
          {/* course name  */}
          <p className=" courseName text-lg font-semibold "> {course?.name} </p>

          {/* course category  */}
          <p className=" courseCategory  ">
            <span className=" font-semibold ">Category : </span>

            {course?.category}
          </p>

          {/* course instructors  */}
          <div className="courseInstructors">
            <p className=" font-semibold ">Instructors : </p>
            <ul className=" list-inside list-disc text-sm ">
              {course?.instructors &&
                course?.instructors?.map((indtructor: TInstructor) => (
                  <li className=" pl-3 font-medium text-prime100 ">
                    {indtructor?.name}
                  </li>
                ))}
            </ul>
          </div>

          <div className="bottomSection py-3 flex justify-between items-center ">
            {/* course price  */}
            <p className=" coursePrice  text-prime200 font-semibold ">
              Price : ${course?.price}
            </p>

            {/* button  */}
            <div className="btn ">
              <Link to={`/course-detail/${course?._id}`}>
                <Button className=" bg-prime100 hover:bg-prime200 ">
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

export default CourseCard;
