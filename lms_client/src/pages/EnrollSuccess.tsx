import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnrollSuccess = () => {
  const navigate = useNavigate();

  const handleNavigateProduct = () => {
    navigate("/my-courses");
  };

  return (
    <div className="EnrollSuccessContainer bg-gray-100">
      <div className="EnrollSuccessWrapper min-h-screen  flex justify-center items-center ">
        <div className="confirmationCard bg-white py-8 px-16 rounded-md shadow-md border border-gray-300 flex flex-col  justify-center items-center gap-y-3  ">
          {/* icon starts  */}
          <div className="icon  text-center flex justify-center items-center ">
            <CircleCheck
              size={48}
              strokeWidth={2.5}
              className="  text-prime100 "
            />
          </div>
          {/* icon ends  */}

          <p className=" text-3xl font-semibold ">
            Course Purchased Successfully !!!
          </p>

          <Button
            onClick={() => handleNavigateProduct()}
            className=" mt-3  bg-prime100 hover:bg-prime100 hover:scale-[1.01] hover:shadow-md active:scale-100  "
          >
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollSuccess;
