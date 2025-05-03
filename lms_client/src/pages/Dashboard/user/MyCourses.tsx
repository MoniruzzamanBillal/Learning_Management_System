import Wrapper from "@/components/shared/Wrapper";
import { MyCourseCard } from "@/components/ui/user/MyCourses";

const MyCourses = () => {
  return (
    <div className="MyCoursesContainer bg-gray-100  ">
      <Wrapper className="MyCoursesWrapper py-8 ">
        <h3 className="brand text-3xl font-medium mb-8 ">My Courses</h3>

        <div className="courseCardBody flex flex-col gap-y-8 ">
          <MyCourseCard />
          <MyCourseCard />
          <MyCourseCard />
        </div>
      </Wrapper>
    </div>
  );
};

export default MyCourses;
