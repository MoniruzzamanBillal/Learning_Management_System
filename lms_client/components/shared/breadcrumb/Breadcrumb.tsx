"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Breadcrumb = () => {
  const pathname = usePathname(); // Get the current path
  const pathSegments = pathname.split("/").filter(Boolean); // Split and remove empty segments

  const formatSegment = (str: string) =>
    decodeURIComponent(str)
      .replace(/[_-]+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <nav className="hidden sm:block">
      <div className="flex items-center space-x-2">
        <Link
          href="/"
          className="text-text text-xs hover:text-red-700 hover:underline md:text-sm"
        >
          Home /
        </Link>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={index + 1}>
              {index !== 0 && <span className="">/</span>}
              {isLast ? (
                <span className="text-xs leading-7 font-medium text-gray-400 md:text-sm">
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-brandMain text-xs leading-7 hover:underline md:text-sm"
                >
                  {formatSegment(segment)}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
