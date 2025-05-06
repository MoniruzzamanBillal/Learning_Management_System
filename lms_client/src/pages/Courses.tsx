import Wrapper from "@/components/shared/Wrapper";
import { CategoryFilter } from "@/components/ui/courses";
import { Input } from "@/components/ui/input";
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
            <h1>course section </h1>
            <h1>course section </h1>
            <h1>course section </h1>
            <h1>course section </h1>
          </div>

          {/*  */}
        </div>
      </Wrapper>
    </div>
  );
};

export default Courses;
