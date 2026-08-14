"use client";

import Wrapper from "@/components/shared/Wrapper";
import { useFetchData } from "@/hooks/useApi";
import Image from "next/image";
import TutorSkeleton from "./TutorSkeleton";

type TUser = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
};

export default function TutorSection() {
  const { data: instructorData, isLoading: instructorDataLoading } =
    useFetchData<TUser[]>(["all-instructors"], "/user/get-instructors");

  let content = null;

  if (instructorDataLoading) {
    content = Array.from({ length: 4 }).map((_, i) => (
      <TutorSkeleton key={i} />
    ));
  } else if (instructorData?.data) {
    content = instructorData.data.map((instructor: TUser) => (
      <div
        key={instructor._id}
        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col items-center text-center"
      >
        {/* Avatar */}
        <div className="size-20 rounded-full overflow-hidden border-2 border-indigo-100 mb-3 shrink-0">
          <Image
            height={160}
            width={160}
            src={instructor.profilePicture}
            className="w-full h-full object-cover"
            alt={instructor.name}
          />
        </div>

        {/* Role badge */}
        <span className="bg-indigo-50 text-prime-100 text-xs font-medium px-3 py-1 rounded-full mb-2">
          Instructor
        </span>

        {/* Name */}
        <p className="font-semibold text-gray-900 text-base">{instructor.name}</p>

        {/* Email */}
        <p className="text-gray-500 text-sm truncate w-full text-center mt-0.5">
          {instructor.email}
        </p>
      </div>
    ));
  }

  return (
    <section className="bg-white py-16">
      <Wrapper>
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
            Our Instructors
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet the Experts
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            Learn from seasoned professionals with real-world experience in
            their fields.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {content}
        </div>
      </Wrapper>
    </section>
  );
}
