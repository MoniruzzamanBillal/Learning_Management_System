"use client";

import { useState } from "react";
import { RiCloseFill, RiMenu3Fill } from "react-icons/ri";

import Link from "next/link";
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
  // const userInfo = useGetUser();

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
          <Link href={"/"}>
            <p className="  text-2xl  xmd:text-xl lg:text-3xl font-bold font-headingFont cursor-pointer ">
              MATS <span className=" text-prime50 ">Academy</span>
            </p>
          </Link>
        </div>

        {/* Menu icon */}
        <div
          onClick={() => setOpen(!open)}
          className="   flex justify-center items-center   cursor-pointer md:hidden  font-bold  text-2xl "
        >
          {open ? <RiCloseFill className="  " /> : <RiMenu3Fill />}
        </div>

        {/* rigth section  */}
        {/* linke items */}
        <ul
          className={`absolute bg-white/90 shadow-md text-end  
        md:shadow-none z-[-1] left-0 w-full pr-8 md:pr-12 
        md:flex md:items-center pb-8 md:pb-0 
        md:static md:bg-transparent md:z-auto md:w-auto md:pl-0 transition-all 
        duration-100 ease-in text-base 
        ${open ? "top-[2.8rem] block" : "top-[-490px]"}`}
          style={{
            backdropFilter: "blur(3rem)",
          }}
        >
          {Links &&
            Links.map((link, index) => (
              <li
                key={index}
                className="  my-4 md:ml-5 md:my-0  font-bold uppercase"
              >
                <Link
                  href={link.link}
                  className=" hover:text-prime50 duration-500  "
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

          {/* {userInfo?.userRole === userRoleConts.user && (
            <Link
              href={"/my-courses"}
              className=" hover:text-prime50 duration-500 pl-4 font-bold uppercase "
              onClick={() => setOpen(false)}
            >
              My Courses
            </Link>
          )} */}

          <div className="buttonSection mt-2 md:mt-0  md:ml-4 flex justify-end md:justify-center  items-center gap-x-0.5   ">
            <Link href={"/login"} onClick={() => setOpen(!open)}>
              <Button
                size={"sm"}
                className=" -z-[1] text-xs sm:text-sm md:text-base bg-prime-50 hover:bg-prime-100 cursor-pointer "
              >
                Sign in
              </Button>
            </Link>
            {/* 
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
            )} */}
            {/*  */}
            {/*  */}
          </div>
        </ul>
      </Wrapper>
    </div>
  );
};

export default NavBar;
