import { Outlet } from "react-router-dom";
import NavBar from "../shared/NavBar";

export const MainLayout = () => {
  return (
    <div className="MainLayoutContainer  ">
      {/* nav starts  */}
      <NavBar />
      {/* nav ends */}

      {/* child component  */}
      <div className="childComponent mt-[4.2rem]   ">
        <Outlet />
      </div>
      {/* child component  */}

      <div className="footerContainer   ">
        <h1>footer </h1>
      </div>
    </div>
  );
};
