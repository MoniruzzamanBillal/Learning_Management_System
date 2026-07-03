import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { TUserEnrolledCourse } from "./type";

const MyCourseCard = ({ courseData }: { courseData: TUserEnrolledCourse }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-200">
      {/* Cover image */}
      <div className="w-full sm:w-48 h-44 sm:h-auto shrink-0 overflow-hidden">
        <Image
          src={courseData?.course?.courseCover}
          height={400}
          width={400}
          className="w-full h-full object-cover"
          alt={courseData?.course?.name}
        />
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <p className="font-semibold text-gray-900 text-base line-clamp-2">
          {courseData?.course?.name}
        </p>
        <p className="text-gray-400 text-xs uppercase tracking-wide">
          MATS Academy
        </p>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <Progress value={courseData?.courseProgress} className="flex-1" />
          <span className="text-prime-100 font-semibold text-sm shrink-0">
            {courseData?.courseProgress}%
          </span>
        </div>

        <Link href={`/my-courses/${courseData?.course?._id}`} className="w-fit">
          <Button className="bg-prime-100 hover:bg-prime-200 text-white text-sm cursor-pointer">
            Continue
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyCourseCard;
