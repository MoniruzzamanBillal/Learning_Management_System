import { dummyManageModule } from "@/components/TestingTable/DummyData";
import {
  ManageModuleColumn,
  ManageModuleTable,
} from "@/components/ui/instructor/ManageModule";

const ManageModule = () => {
  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Modules</h3>

        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">
          <ManageModuleTable
            columns={ManageModuleColumn}
            data={dummyManageModule}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageModule;
