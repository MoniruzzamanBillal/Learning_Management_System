import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TUserEnrolledCourse } from "./type";

const MyCourseCard = ({ courseData }: { courseData: TUserEnrolledCourse }) => {
  const isCompleted = courseData?.completed;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col">
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <Image
          fill
          src={courseData?.course?.courseCover}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          alt={courseData?.course?.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-prime-100 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {courseData?.course?.category}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <p className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-prime-100 transition-colors duration-200">
          {courseData?.course?.name}
        </p>
        <p className="text-gray-400 text-xs uppercase tracking-wide">
          MATS Academy
        </p>

        {/* Progress / completed state */}
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Completed
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Progress value={courseData?.courseProgress} className="flex-1" />
            <span className="text-prime-100 font-semibold text-sm shrink-0">
              {courseData?.courseProgress}%
            </span>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100">
          <Link
            href={`/my-courses/${courseData?.course?._id}`}
            className="w-fit"
          >
            <Button
              size="sm"
              className="bg-prime-100 hover:bg-prime-200 text-white text-xs px-4 rounded-lg cursor-pointer"
            >
              {/* {isCompleted ? "Review Course" : "Continue"} */}
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCourseCard;
