import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();

  return (
    <div className="CourseDetailContainer">
      <div className="CourseDetailWrapper bg-gray-100 border border-gray-300  shadow rounded-md p-4">
        <h3 className="brand text-3xl font-medium mb-4 underline  ">
          Course Detail :
        </h3>

        <div className="courseDetailBody">
          {/* heading section  */}
          <div className="headingSection mb-8 flex justify-between items-center">
            <div className="headingLeft">
              <h1 className=" font-medium text-xl  "> Course id : #{id} </h1>
            </div>

            {/*  */}
          </div>

          {/* course detail body  */}
          <div className="detailBody text-lg ">
            {/* course name  */}
            <p className="courseName">
              <span className=" font-bold ">Course name : </span> Mastering
              Frontend Development with js
            </p>

            {/* course category  */}
            <p className="courseCategory">
              <span className=" font-bold ">Course category : </span> Web
              Development
            </p>

            {/* course price */}
            <p className="coursePrice">
              <span className=" font-bold ">Course price : </span> 200
            </p>

            {/* course detail */}
            <p className="coursePrice">
              <span className=" font-bold ">Course details : </span> course
              details
            </p>

            {/* instructors table  */}
            <div className="instructorsTable pt-8 ">
              <h1 className=" font-medium text-xl mb-2 underline ">
                Instructors :
              </h1>
              <div className="instructorsTable">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th> Name</th>
                      <th> Email </th>
                      <th> profilePicture </th>
                    </tr>
                  </thead>
                  {/* <tbody>{content}</tbody> */}
                </table>
              </div>
            </div>

            {/* module table  */}
            <div className="modulesTable pt-8 ">
              <h1 className=" font-medium text-xl mb-2 underline ">
                Modules :
              </h1>
              <div className="modulesTable">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th> Title</th>
                      <th> Videos </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  {/* <tbody>{content}</tbody> */}
                </table>
              </div>
            </div>

            {/*  */}
          </div>

          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
