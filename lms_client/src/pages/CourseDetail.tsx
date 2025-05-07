import Wrapper from "@/components/shared/Wrapper";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();

  console.log("course id = ", courseId);

  return (
    <div className="CourseDetailContainer">
      <div className="CourseDetailWrapper">
        {/* corse detail top name section  */}
        <div className="courseTopSection  py-8 bg-gray-200  ">
          <Wrapper className="courseNameSection   flex flex-col gap-y-4  ">
            {/* course name  */}
            <p className=" text-3xl font-semibold ">Course name </p>

            <p className=" text-lg font-medium "> Course Level : Beginner</p>

            {/* course instructors  */}
            <div className="courseInstructors">
              <p className=" text-lg font-semibold ">Course instructors : </p>
              <ul className=" list-inside list-decimal ">
                <li className=" pl-3 font-medium text-prime100 ">
                  Instructor 1
                </li>
                <li className=" pl-3 ">Instructor 2</li>
              </ul>
            </div>

            <p className=" text-lg font-medium ">Total Modules : 3 </p>

            <p className=" text-lg font-medium ">Last update : 1 may 2025</p>

            {/*  */}
          </Wrapper>
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default CourseDetail;
