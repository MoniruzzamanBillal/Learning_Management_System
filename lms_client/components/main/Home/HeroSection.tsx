import Wrapper from "@/components/shared/Wrapper";
import bannerImg from "@/public/banner.png";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <Wrapper className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left — text content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Badge */}
          <span className="inline-flex w-fit items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full">
            🎓 Online Learning Platform
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
            Up Your{" "}
            <span className="text-prime-50">Skills</span>{" "}
            To Advance Your{" "}
            <span className="text-prime-50">Career</span> Path
          </h1>

          {/* Sub */}
          <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
            Master Web Development, Cybersecurity, UI/UX, and more with
            expert-led video lessons and real-time progress tracking — learn
            job-ready skills anytime, anywhere.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Link href="/courses">
              <button className="bg-prime-100 hover:bg-prime-200 text-white font-medium px-7 py-3 rounded-lg transition-colors duration-200 cursor-pointer">
                Browse Courses
              </button>
            </Link>
            <Link href="/about-us">
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-7 py-3 rounded-lg transition-colors duration-200 cursor-pointer">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Right — image */}
        <div className="flex-1 relative flex justify-center">
          {/* Subtle background blob */}
          <div className="absolute inset-0 bg-indigo-50 rounded-3xl blur-3xl opacity-60 scale-90" />
          <Image
            src={bannerImg}
            alt="Learning illustration"
            width={560}
            height={560}
            className="relative rounded-2xl shadow-xl w-full max-w-md md:max-w-full object-cover"
            priority
          />
        </div>
      </Wrapper>
    </section>
  );
};

export default HeroSection;
