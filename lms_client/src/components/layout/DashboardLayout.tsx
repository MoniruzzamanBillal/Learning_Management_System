import { Outlet } from "react-router-dom";
import Wrapper from "../shared/Wrapper";
import { Sidebar } from "../ui/Dashboard";

const DashboardLayout = () => {
  return (
    <div className="DashboardLayoutContainer bg-gray-50 dark:bg-black50 ">
      <Wrapper className="dashbaordWrapper min-h-screen mx-auto sm:flex py-4 px-2 gap-x-4 gap-y-6  ">
        {/* sidebar section  */}

        <div className="sideBarContainer  sm:w-64 ">
          <Sidebar />
        </div>
        {/* sidebar section  */}

        {/* children section  */}
        <div className="contentSection w-full    ">
          <Outlet />
        </div>
      </Wrapper>
    </div>
  );
};

export default DashboardLayout;
