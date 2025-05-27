import TableDataLoading from "@/components/shared/TableLoading";
import {
  InstructorColumn,
  ManageInstructorTable,
} from "@/components/ui/admin/ManageInstructor";
import { Button } from "@/components/ui/button";
import { useGetAllInstructorsQuery } from "@/redux/features/user/user.api";
import { useNavigate } from "react-router-dom";

const ManageInstructors = () => {
  const navigate = useNavigate();

  const { data: isntructorData, isLoading } =
    useGetAllInstructorsQuery(undefined);

  // console.log(isntructorData?.data);

  return (
    <>
      {isLoading && <TableDataLoading />}

      <div className="ManageInstructorsContainer">
        <div className="ManageInstructorsWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3 ">
          <h3 className="brand text-2xl font-medium mb-4 ">
            Manage Instructors
          </h3>

          <Button
            onClick={() => navigate("/dashboard/admin/add-instructor")}
            className="mb-4 bg-prime100 hover:bg-prime100 cursor-pointer"
          >
            Add Instructors
          </Button>

          {/* table section  */}
          <div className="Tablecontainer mx-auto py-10">
            {isntructorData?.data && (
              <ManageInstructorTable
                columns={InstructorColumn}
                data={isntructorData?.data}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageInstructors;
