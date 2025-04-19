import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();

  console.log("course id = ", id);

  return (
    <div className="CourseDetailContainer">
      <div className="CourseDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4">
        <h3 className="brand text-2xl font-medium mb-4 "> Course Detail </h3>

        <div className="courseDetailBody">
          <h1>course detail body </h1>
          <h1>course detail body </h1>
          <h1>course detail body </h1>
          <h1>course detail body </h1>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
