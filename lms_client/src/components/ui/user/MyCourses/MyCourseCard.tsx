import { Button } from "../../button";
import { Progress } from "../../progress";

const MyCourseCard = () => {
  return (
    <div className="enrolledCourseCard">
      <div className="enrolledCourseCardWrapper  w-[75%] rounded-md shadow bg-white border border-gray-200 flex justify-between gap-x-5  ">
        {/* left course cover section  */}
        <div className="courseLeftCover w-[40%] h-[13rem] rounded-l-md overflow-auto ">
          <img
            src="https://i.postimg.cc/Z5D1T36s/494358010-646246441651486-5487058506954483020-n.jpg"
            className=" w-full h-full "
            alt=""
          />
        </div>
        {/*  */}

        {/* course detail section  */}
        <div className="detailSection rightSection py-2 w-[60%] flex flex-col gap-y-3  ">
          {/* courseName */}
          <p className=" text-2xl font-medium ">
            Frontend development with js{" "}
          </p>
          {/* platform name  */}
          <p className=" text-lg ">MATS academy </p>

          {/* course progress section  */}
          <div className="courseProgressSection w-[90%] flex justify-center items-center gap-x-6  ">
            <Progress value={33} className="  " />
            <p className=" text-lg font-medium ">33%</p>
          </div>

          {/* button section  */}

          <div className="btnSection">
            <Button className=" bg-prime100 hover:bg-prime200 ">
              Continue{" "}
            </Button>
          </div>
        </div>

        {/*  */}
      </div>

      {/*  */}
    </div>
  );
};

export default MyCourseCard;
