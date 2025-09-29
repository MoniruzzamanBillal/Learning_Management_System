import { userRoleConts } from "@/utils/constants";
import { useGetUser } from "@/utils/sharedFunction";
import { useState } from "react";
import { LuUser } from "react-icons/lu";
import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Wrapper from "./Wrapper";

const Links = [
  { name: "Home", link: "/" },
  { name: "Courses", link: "/courses" },
  { name: "About us", link: "/about-us" },
  { name: "Instructors", link: "/instructors" },
  { name: "FAQ", link: "/faqs" },
  { name: "Contact us", link: "/contact" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const userInfo = useGetUser();

  return (
    <div
      className="  shadow-md w-full fixed top-0 left-0 z-10 "
      style={{
        backdropFilter: "blur(8px)",
      }}
    >
      <Wrapper className="   flex items-center justify-between py-2  m-auto   ">
        {/* logo section */}
        {/* left section  */}
        <div className="imgContainer  ">
          <Link to={"/"}>
            <p className="  text-2xl  xmd:text-xl lg:text-3xl font-bold font-headingFont cursor-pointer ">
              MATS <span className=" text-prime50 ">Academy</span>
            </p>
          </Link>
        </div>

        {/* Menu icon */}
        <div
          onClick={() => setOpen(!open)}
          className="   flex justify-center items-center   cursor-pointer xmd:hidden  font-bold  text-2xl "
        >
          {open ? <RiCloseFill className="  " /> : <RiMenu3Fill />}
        </div>

        {/* rigth section  */}
        {/* linke items */}
        <ul
          className={`absolute bg-white/90 shadow-md text-end  
        xmd:shadow-none z-[-1] left-0 w-full pr-8 xmd:pr-12 
        xmd:flex md:items-center pb-8 xmd:pb-0 
        xmd:static xmd:bg-transparent md:z-auto 
        xmd:w-auto md:pl-0 transition-all 
        duration-100 ease-in 
        text-xs xsm:text-sm sm:text-base 
        md:text-xs xmd:text-xs lg:text-sm xlm:text-base 
        ${open ? "top-[2.8rem] block" : "top-[-490px]"}`}
          style={{
            backdropFilter: "blur(3rem)",
          }}
        >
          {Links &&
            Links.map((link, index) => (
              <li
                key={index}
                className="  my-4 xmd:ml-5 xmd:my-0  font-bold uppercase"
              >
                <Link
                  to={link.link}
                  className=" hover:text-prime50 duration-500  "
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

          {userInfo?.userRole === userRoleConts.user && (
            <Link
              to={"/my-courses"}
              className=" hover:text-prime50 duration-500 pl-4 font-bold uppercase "
              onClick={() => setOpen(false)}
            >
              My Courses
            </Link>
          )}

          <div className="buttonSection mt-2 xmd:mt-0  xmd:ml-4 flex justify-end xmd:justify-center  items-center gap-x-0.5  ">
            {!userInfo ? (
              <Link to={"/login"} onClick={() => setOpen(!open)}>
                <Button
                  size={"sm"}
                  className=" -z-[1] text-xs sm:text-sm md:text-base bg-prime50 hover:bg-prime100 "
                >
                  Sign in
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <Link
                  to="/dashboard/profile"
                  className="inline-block p-1.5 rounded-full bg-orange-100 cursor-pointe"
                >
                  {userInfo?.profileImage ? (
                    <Avatar>
                      <AvatarImage src={userInfo?.profileImage} />
                      <AvatarFallback>
                        <LuUser className=" text-2xl font-bold text-gray-800 " />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <LuUser className=" text-2xl font-bold text-gray-800 " />
                  )}
                </Link>
              </div>
            )}

            {/*  */}
            {/*  */}
          </div>
        </ul>
      </Wrapper>
    </div>
  );
};

export default NavBar;
