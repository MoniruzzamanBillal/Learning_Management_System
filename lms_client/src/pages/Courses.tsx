import Wrapper from "@/components/shared/Wrapper";
import { CategoryFilter, CourseCard } from "@/components/ui/courses";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryType, setcategoryType] = useState("");

  return (
    <div className="CoursesContainer bg-gray-100 py-4 min-h-screen ">
      <Wrapper className="CoursesWrapper">
        {/* search section   */}
        <div className="searchSection bg-gray-50 border border-gray-300  w-[50%] m-auto py-1 px-5 rounded-full flex justify-center items-center mb-8  ">
          <Input
            type="text"
            placeholder="Looking for...."
            className=" border-none outline-none "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* main body section starts  */}
        <div className="mainBody flex flex-col xl:flex-row justify-between  gap-x-6 gap-y-8">
          {/* left category section  */}
          <div className="categorySection  w-full xl:w-[16%] ">
            <CategoryFilter
              categoryType={categoryType}
              setcategoryType={setcategoryType}
            />
          </div>

          {/* right course section   */}
          <div className="courseSection w-full xl:w-[84%]">
            {/* course card section  */}
            <div className="courseCard  grid grid-cols-3 gap-x-4 gap-y-6  ">
              <CourseCard />
              <CourseCard />
              <CourseCard />
              <CourseCard />
              <CourseCard />
              <CourseCard />
              <CourseCard />
              <CourseCard />
              <CourseCard />
            </div>

            {/* pagination section  */}
            <div className="paginationSection mt-6 ">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {/*  */}
        </div>
      </Wrapper>
    </div>
  );
};

export default Courses;
