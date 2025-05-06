import Wrapper from "@/components/shared/Wrapper";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="CoursesContainer bg-gray-100 py-4 min-h-screen ">
      <Wrapper className="CoursesWrapper">
        {/* search section   */}
        <div className="searchSection bg-gray-50 border border-gray-300  w-[50%] m-auto py-1 px-5 rounded-full flex justify-center items-center mb-5  ">
          <Input
            type="text"
            placeholder="Looking for...."
            className=" border-none outline-none "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h1>courses </h1>
        <h1>courses </h1>
        <h1>courses </h1>
        <h1>courses </h1>
        <h1>courses </h1>
        <h1>courses </h1>
      </Wrapper>
    </div>
  );
};

export default Courses;
