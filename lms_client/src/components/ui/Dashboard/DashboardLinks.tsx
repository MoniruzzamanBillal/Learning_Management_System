import { TDashboardLinks } from "@/types/globalTypes";
import { NavLink } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";

import { useGetUser } from "@/utils/sharedFunction";
import { userRoleConts } from "@/utils/constants";

const DashboardLinks = () => {
  const userInfo = useGetUser();

  let links;

  if (userInfo?.userRole === userRoleConts.user) {
    links = [
      {
        name: "Home",
        path: "/",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
      {
        name: "Profile",
        path: "/",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
      {
        name: "My Courses",
        path: "/",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
    ];
  }

  if (userInfo?.userRole === userRoleConts?.admin) {
    links = [
      {
        name: "Home",
        path: "/",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
      {
        name: "Manage Courses",
        path: "/dashboard/admin/manage-course",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
      {
        name: "Manage Modules",
        path: "/dashboard/admin/manage-modules",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
      {
        name: "Manage Videos",
        path: "/dashboard/admin/manage-videos",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
      {
        name: " Enrollment & Progress",
        path: "/dashboard/admin/manage-videos",
        icon: <CiBookmark className="text-xl font-bold" />,
      },
    ];
  }

  return (
    <div>
      {links && links?.map((item) => <LinkItem key={item?.name} link={item} />)}
    </div>
  );
};

const LinkItem = ({ link }: { link: TDashboardLinks }) => {
  return (
    <NavLink to={link.path}>
      <div className="linksContainer flex items-center gap-x-1  my-6  hover:text-prime100 ">
        {link.icon}
        <p>{link.name}</p>
      </div>
    </NavLink>
  );
};

export default DashboardLinks;
