import { logOut } from "@/redux/features/auth/auth.slice";
import { useAppDispatch } from "@/redux/hook";
import { CiLogin } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import DashboardLinks from "./DashboardLinks";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const { data: userData, isLoading: userDataLoading } =
  //     useGetLoggedInUserQuery(undefined, { refetchOnMountOrArgChange: true });

  // ! for logout
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-md p-4 sticky top-[5.2rem] shadow-md  ">
      <div className="flex items-center space-x-2 border-b-4 border-prime50 pb-2 print:hidden">
        <div className=" p-2 rounded-full bg-slate-200 cursor-pointe   ">
          <LuUser className=" text-2xl font-bold text-gray-800 " />
        </div>

        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* dashboard links starts  */}
      <nav className="dashboardNavLinks mt-4">
        <DashboardLinks />
        <div
          onClick={() => handleLogout()}
          className="  mt-4 flex items-center gap-x-1  cursor-pointer font-medium p-1 border border-gray-300 "
        >
          <CiLogin className=" text-xl  " />
          Logout
        </div>
      </nav>
      {/* dashboard links ends  */}
    </div>
  );
};

export default Sidebar;
