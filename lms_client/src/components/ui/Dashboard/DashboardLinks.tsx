import { TDashboardLinks } from "@/types/globalTypes";
import { CiBookmark } from "react-icons/ci";
import { NavLink } from "react-router-dom";

import { userRoleConts } from "@/utils/constants";
import { useGetUser } from "@/utils/sharedFunction";

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
        name: " Enrollment ",
        path: "/dashboard/admin/enroll-courses",
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
