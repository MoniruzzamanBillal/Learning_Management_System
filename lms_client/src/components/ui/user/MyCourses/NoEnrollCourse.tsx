const NoEnrollCourse = () => {
  return (
    <div className="NoEnrollCourseContainer flex  robotoFont mt-6 flex-col items-center justify-center   py-8 ">
      <h1 className=" text-3xl sm:text-4xl font-bold text-prime100 mb-4">
        You Have not enrolled into any course !!!
      </h1>

      <p className="text-gray-600 text-base sm:text-lg mb-8">
        Explore our courses and start learning today!
      </p>
    </div>
  );
};

export default NoEnrollCourse;
