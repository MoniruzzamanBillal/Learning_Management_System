"use client";

import { useGetUser } from "@/hooks/useGetUser";
import { userRoleConts } from "@/utils/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { CiLogin } from "react-icons/ci";
import { LuUser } from "react-icons/lu";
import { adminLinks } from "./DashbaordLinks/AdminLinks";
import { InstructorLinks } from "./DashbaordLinks/InstructorLinks";
import { UserLinks } from "./DashbaordLinks/UserLinks";

type Tsidebar = {
  name: string;
  path: string;
  icon: ReactNode;
};

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  console.log("pathname = ", pathname);

  const userInfo = useGetUser();

  let links: Tsidebar[] = [];

  if (userInfo?.userRole === userRoleConts.user) {
    links = UserLinks;
  }

  if (userInfo?.userRole === userRoleConts.admin) {
    links = adminLinks;
  }

  if (userInfo?.userRole === userRoleConts.instructor) {
    links = InstructorLinks;
  }

  // ! for logout
  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-md p-4 sticky top-[5.2rem] shadow-md  ">
      <div className="flex items-center space-x-2 border-b-4 border-prime-50 pb-2 print:hidden">
        <div className=" p-2 rounded-full bg-slate-200 cursor-pointe   ">
          <LuUser className=" text-2xl font-bold text-gray-800 " />
        </div>

        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* dashboard links starts  */}
      <nav className="dashboardNavLinks mt-4">
        {links.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link key={item.name} href={item.path}>
              <div
                className={`flex items-center gap-x-2 my-4 cursor-pointer font-medium p-2 rounded-md transition
                  ${
                    isActive
                      ? "bg-prime-100 text-white"
                      : "hover:text-prime-100"
                  }`}
              >
                {item.icon}
                <p>{item.name}</p>
              </div>
            </Link>
          );
        })}

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
