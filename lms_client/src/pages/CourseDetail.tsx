import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();

  console.log("course id = ", courseId);

  return (
    <div className="CourseDetailContainer bg-gray-50 min-h-screen ">
      <div className="CourseDetailWrapper">
        {/* course detail top name section  */}
        <div className="courseTopSection  py-8 bg-gray-200  ">
          <Wrapper className="courseNameTopSection   flex justify-between gap-x-3     ">
            {/* course name section  */}
            <div className="courseNameSection  w-[70%] flex flex-col gap-y-4 ">
              {/* course name  */}
              <p className=" text-3xl font-semibold ">Course name </p>

              <p className=" text-lg font-medium ">
                {" "}
                Course Category : Web Dev{" "}
              </p>

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
            </div>

            {/* course cover , price  section  */}
            <div className="courseCoverImg  w-[30%] border border-gray-200 rounded bg-gray-50 shadow p-3 flex flex-col gap-y-3 ">
              {/* image section  */}
              <div className="courseCover h-[12rem] rounded-t overflow-auto">
                <img
                  src="https://i.postimg.cc/T3gDnj7S/494358010-646246441651486-5487058506954483020-n.jpg"
                  className=" w-full h-full "
                  alt="course_cover"
                />
              </div>

              {/* course price section  */}
              <p className=" py-2 text-2xl font-semibold text-prime200 ">
                Price : $120
              </p>

              {/* enroll button  */}
              <Button className="  bg-prime100 hover:bg-prime200 ">
                Enroll Now{" "}
              </Button>

              {/*  */}
            </div>

            {/*  */}
          </Wrapper>
        </div>

        {/* course detail section  */}
        <Wrapper className=" courseDetail mt-2 ">
          <h1>About this course : </h1>

          <div
            className="  courseDetail "
            // dangerouslySetInnerHTML={{
            //   __html: courseData?.data?.description,
            // }}
          ></div>
        </Wrapper>

        {/*  */}
      </div>
    </div>
  );
};

export default CourseDetail;
