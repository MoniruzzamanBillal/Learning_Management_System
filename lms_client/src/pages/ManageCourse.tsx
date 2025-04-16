import { Button } from "@/components/ui/button";

const ManageCourse = () => {
  return (
    <div className="ManageCourseContainer">
      <div className="manageCourseWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Course </h3>

        <Button
          onClick={() =>
            (window.location.href = "/dashboard/admin/manage-course")
          }
          className="mb-4 bg-prime100 hover:bg-prime100 cursor-pointer"
        >
          Add Course
        </Button>
      </div>
    </div>
  );
};

export default ManageCourse;
