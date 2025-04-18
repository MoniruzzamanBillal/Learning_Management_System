import {
  manageModuleColumns,
  ManageModuleTable,
} from "@/components/ui/admin/manageModule";
import { modulesDummyData } from "@/utils/DummyData";

const ManageModule = () => {
  return (
    <div className="ManageModuleContainer">
      <div className="ManageModuleWrapper bg-gray-100/90 border border-gray-300  shadow rounded-md p-3">
        <h3 className="brand text-2xl font-medium mb-4 "> Manage Module </h3>
        {/*  */}

        {/* table section  */}
        <div className="Tablecontainer mx-auto py-10">
          <ManageModuleTable
            columns={manageModuleColumns}
            data={modulesDummyData}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageModule;
