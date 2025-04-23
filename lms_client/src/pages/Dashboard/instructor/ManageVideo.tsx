import { dummyManageVideo } from "@/components/TestingTable/DummyData";
import {
  ManageVideoColumn,
  ManageVideoTable,
} from "@/components/ui/instructor/ManageVideo";

const ManageVideo = () => {
  return (
    <div className="ManageVideoContainer">
      <div className="ManageVideoWrapper  bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Videos </h3>

        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">
          <ManageVideoTable
            columns={ManageVideoColumn}
            data={dummyManageVideo}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageVideo;
