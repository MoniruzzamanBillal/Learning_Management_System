/* eslint-disable @typescript-eslint/no-explicit-any */
import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import { userRoleConts } from "@/utils/constants";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

export type InstructorType = {
  _id: string;
  name: string;
};

export type CourseDetailType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  courseCover: string;
  instructors: InstructorType[];
  modules: string[];
  updatedAt: string;
};

type TCourseDetailProps = {
  courseDetails: CourseDetailType;
  alreadyEnrolled: boolean;
  userInfo?: {
    userId: string;
    userRole: keyof typeof userRoleConts;
  };
};

const CourseDetailTop = ({
  courseDetails,
  alreadyEnrolled,
  userInfo,
}: TCourseDetailProps) => {
  const { mutateAsync: enrollCourseMutaion, isPending } = usePost([
    [`course-${courseDetails?._id}`],
    [`course-detail-${courseDetails?._id}`],
    [`course-review-${courseDetails?._id}`],
    [`review-eligibility-${courseDetails?._id}`],
  ]);

  const handleEnrollCourse = async (courseId: string) => {
    if (!userInfo?.userId) {
      toast.error("Login to enroll into this course!");
      return;
    }

    const payload = {
      user: userInfo.userId,
      course: courseId,
    };

    try {
      const toastId = toast.loading("Purchasing Course...");

      const result = await enrollCourseMutaion({
        url: `/enroll/enroll-course`,
        payload,
      });

      if (result?.error) {
        const errorMessage = (result?.error as any)?.data?.message;
        toast.error(errorMessage, { id: toastId, duration: 1400 });
      }

      if (result?.data) {
        toast.success(result?.message, { id: toastId, duration: 2000 });
        window.location.href = result.data;
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Something went wrong while purchasing the course!",
        { duration: 1400 },
      );
    }
  };

  const instructorNames = courseDetails?.instructors
    ?.map((i) => i.name)
    .join(", ");

  return (
    <div className="bg-gray-900 text-white py-12">
      <Wrapper>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left — course info */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Category badge */}
            <span className="bg-indigo-500/20 text-prime-50 rounded-full px-3 py-1 text-xs font-medium w-fit">
              {courseDetails?.category}
            </span>

            {/* Course name */}
            <h1 className="text-3xl font-bold text-white leading-snug">
              {courseDetails?.name}
            </h1>

            {/* Instructor */}
            {instructorNames && (
              <p className="text-indigo-200 text-sm">
                By {instructorNames}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
              <span>{courseDetails?.modules?.length} Modules</span>
              <span>·</span>
              <span>
                Updated{" "}
                {format(new Date(courseDetails?.updatedAt), "dd MMM yyyy")}
              </span>
              <span>·</span>
              <span>Level: Beginner</span>
            </div>
          </div>

          {/* Right — price card */}
          <div className="w-full md:w-72 bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-3 self-start shrink-0">
            {/* Cover image */}
            <div className="h-44 rounded-xl overflow-hidden">
              <Image
                src={courseDetails?.courseCover}
                height={1280}
                width={1280}
                className="w-full h-full object-cover"
                alt={courseDetails?.name}
              />
            </div>

            {/* Price */}
            <p className="text-prime-100 font-bold text-2xl">
              ${courseDetails?.price}
            </p>

            {/* Enroll / enrolled state */}
            {alreadyEnrolled ? (
              <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg py-2.5 text-center text-sm font-medium">
                ✓ Course Enrolled
              </div>
            ) : (
              <Button
                disabled={
                  isPending ||
                  userInfo?.userRole === userRoleConts.admin ||
                  userInfo?.userRole === userRoleConts?.instructor
                }
                onClick={() => handleEnrollCourse(courseDetails?._id)}
                className="bg-prime-100 hover:bg-prime-200 text-white w-full cursor-pointer"
              >
                {isPending ? "Processing..." : "Enroll Now"}
              </Button>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default CourseDetailTop;
