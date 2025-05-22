import Wrapper from "@/components/shared/Wrapper";
import { useGetAllInstructorQuery } from "@/redux/features/instructor/isntructor.api";
import TutorSkeleton from "./TutorSkeleton";

type TUser = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
};

const TutorSection = () => {
  const { data: instructorData, isLoading: instructorDataLoading } =
    useGetAllInstructorQuery(undefined);

  // console.log(instructorData?.data);

  // console.log(instructorDataLoading);

  let content = null;

  // ! if data is loading
  if (instructorDataLoading) {
    content = Array.from({ length: 4 })?.map((_, ind) => {
      <TutorSkeleton key={ind} />;
    });
  } else if (instructorData?.data) {
    content = instructorData?.data?.map((instructor: TUser) => (
      <div
        key={instructor?._id}
        className="instructorCard m-auto flex flex-col justify-center items-center "
      >
        {/* image section  */}
        <div className="imgSection size-[4.2rem] xsm:size-[5rem] ">
          <img
            src={instructor?.profilePicture}
            className=" w-full h-full rounded-full "
            alt=""
          />
        </div>
        <p className=" text-base xsm:text-lg  font-medium  ">
          {instructor?.name}
        </p>
        <p className=" text-base xsm:text-lg  font-medium text-prime100 ">
          {instructor?.email}
        </p>
      </div>
    ));
  }

  return (
    <div className="TutorSectionContainer py-8 bg-gray-100 ">
      <Wrapper className="TutorSectionWrapper  ">
        <p className=" text-prime100 font-medium text-center text-lg ">
          Tutors
        </p>

        <h1 className=" font-medium text-center  text-xl xsm:text-2xl md:text-3xl ">
          Meet the Heroes{" "}
        </h1>

        <div className="instructorContainer mt-12 grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 ">
          {content}
        </div>
      </Wrapper>
    </div>
  );
};

export default TutorSection;
