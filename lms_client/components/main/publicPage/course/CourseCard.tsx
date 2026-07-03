import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { TCourse, TInstructor, TReview } from "./Course.type";

type TCourseDataProps = {
  course: TCourse;
};

const CourseCard = ({ course }: TCourseDataProps) => {
  const instructorNames = course.instructors
    ?.map((i: TInstructor) => i.name)
    .join(", ");

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col">
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <Image
          fill
          src={course.courseCover}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          alt={course.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-prime-100 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {course.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-prime-100 transition-colors duration-200">
          {course.name}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Instructor — labeled so it's clear who this person is */}
        {instructorNames && (
          <div className="flex items-center gap-1.5 text-xs">
            <GraduationCap className="h-3.5 w-3.5 text-prime-50 shrink-0" />
            <span className="text-gray-400 shrink-0">Instructor:</span>
            <span className="text-gray-700 font-medium line-clamp-1">
              {instructorNames}
            </span>
          </div>
        )}

        {/* Rating + modules in one compact row */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-0.5">
            {renderStars(course.reviewData)}
          </div>
          <span className="text-gray-400">
            ({course.reviewData?.totalReviews ?? 0})
          </span>
          <span className="text-gray-300">·</span>
          <BookOpen className="h-3 w-3 text-gray-400 shrink-0" />
          <span>{course.modules?.length ?? 0} Modules</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="text-prime-100 font-bold text-lg">
            ${course.price}
          </span>
          <Link href={`/courses/${course._id}`}>
            <Button
              size="sm"
              className="bg-prime-100 hover:bg-prime-200 text-white text-xs px-4 rounded-lg cursor-pointer"
            >
              View Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const renderStars = (reviewData?: TReview) => {
  const filled = Math.floor(reviewData?.averageRating ?? 0);
  return Array.from({ length: 5 }, (_, i) => (
    <FaStar
      key={i}
      className={i < filled ? "text-orange-400" : "text-gray-200"}
      size={11}
    />
  ));
};

export default CourseCard;
