import { Button } from "../button";

const CourseCard = () => {
  return (
    <div className="CourseCardContainer bg-gray-50 border border-gray-300 shadow rounded  ">
      <div className="CourseCardWrapper flex flex-col gap-y-2 ">
        {/* course cover section  */}
        <div className="courseCover h-[14rem] rounded-t overflow-auto relative ">
          <img
            src="https://i.postimg.cc/T3gDnj7S/494358010-646246441651486-5487058506954483020-n.jpg"
            className=" w-full h-full "
            alt="course_cover"
          />

          <span className="  courseLabel absolute top-0 left-0 bg-prime50 text-gray-100 text-xs py-1 px-2 rounded ">
            Beginner
          </span>
        </div>

        <div className="courseDetailBody px-3 flex flex-col gap-y-2 ">
          {/* course name  */}
          <p className=" courseName text-lg font-semibold ">Course name </p>

          {/* course category  */}
          <p className=" courseCategory  ">
            <span className=" font-semibold ">Category :</span> web Dev{" "}
          </p>

          {/* course instructors  */}
          <div className="courseInstructors">
            <p className=" font-semibold ">Instructors : </p>
            <ul className=" list-inside list-disc text-sm ">
              <li>Instructor 1</li>
              <li>Instructor 1</li>
            </ul>
          </div>

          <div className="bottomSection py-3 flex justify-between items-center ">
            {/* course price  */}
            <p className=" coursePrice  ">
              <span className=" font-semibold ">Price :</span> $200
            </p>

            {/* button  */}
            <div className="btn ">
              <Button className=" bg-prime100 hover:bg-prime200 ">
                See Details
              </Button>
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
