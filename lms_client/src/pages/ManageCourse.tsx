import ShowTablePage from "@/components/TestingTable/ShowTablePage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ManageCourse = () => {
  const navigate = useNavigate();

  return (
    <div className="ManageCourseContainer">
      <div className="manageCourseWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Course </h3>

        <Button
          onClick={() => navigate("/dashboard/admin/add-course")}
          className="mb-4 bg-prime100 hover:bg-prime100 cursor-pointer"
        >
          Add Course
        </Button>

        <div className="tableSection">
          <ShowTablePage />
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
