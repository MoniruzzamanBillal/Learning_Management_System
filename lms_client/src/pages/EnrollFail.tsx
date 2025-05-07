import { Button } from "@/components/ui/button";
import { MessageSquareX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnrollFail = () => {
  const navigate = useNavigate();

  const handleNavigateProduct = () => {
    navigate("/courses");
  };

  return (
    <div className="EnrollFailContainer bg-gray-100 ">
      <div className="EnrollFailWrapper min-h-screen  flex justify-center items-center">
        <div className="failCard bg-white py-8 px-16 rounded-md shadow-md border border-gray-300 flex flex-col  justify-center items-center gap-y-3  ">
          {/* icon starts  */}
          <div className="icon  text-center flex justify-center items-center ">
            <MessageSquareX
              size={48}
              strokeWidth={2.5}
              className="  text-red-600 "
            />
          </div>
          {/* icon ends  */}

          <p className=" text-3xl font-semibold ">
            Failed to purchase the course !!!
          </p>

          <Button
            onClick={() => handleNavigateProduct()}
            className=" mt-3  bg-prime100 hover:bg-prime100 hover:scale-[1.01] hover:shadow-md active:scale-100  "
          >
            Buy Course Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollFail;
