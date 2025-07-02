import TableDataLoading from "@/components/shared/TableLoading";
import {
  ManageCourseColumn,
  ManageCourseTable,
} from "@/components/ui/instructor/ManageAssignCourse";
import { useGetInstructorAssignedCourseQuery } from "@/redux/features/course/course.api";
import { useGetUser } from "@/utils/sharedFunction";

const ManageAssignCourse = () => {
  const user = useGetUser();

  if (!user?.userId) {
    throw new Error("Something went wrong");
  }

  const { data: isntructorAssignedCourses, isLoading } =
    useGetInstructorAssignedCourseQuery(user?.userId, { skip: !user?.userId });

  // console.log(isntructorAssignedCourses?.data);

  let content = null;

  if (isLoading) {
    content = <TableDataLoading />;
  } else if (!isLoading && isntructorAssignedCourses) {
    content = isntructorAssignedCourses && isntructorAssignedCourses?.data && (
      <div className="Tablecontainer mx-auto py-10">
        <ManageCourseTable
          columns={ManageCourseColumn}
          data={isntructorAssignedCourses?.data}
        />
      </div>
    );
  }

  return (
    <div className="ManageAssignCourseContainer">
      <div className="ManageAssignCourseWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 ">My Assigned Course</h3>

        {/* table section  */}
        {content}
      </div>
    </div>
  );
};

export default ManageAssignCourse;
