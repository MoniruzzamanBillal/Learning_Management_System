import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();

  console.log("course id = ", courseId);

  return (
    <div className="CourseDetailContainer">
      <div className="CourseDetailWrapper">
        <h1>CourseDetail</h1>
        <h1>CourseDetail</h1>
        <h1>CourseDetail</h1>
        <h1>CourseDetail</h1>
        <h1>CourseDetail</h1>
        <h1>CourseDetail</h1>
      </div>
    </div>
  );
};

export default CourseDetail;
