import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import TutorSection from "../home/TutorSection";

const philosophyData = [
  {
    id: 1,
    num: "01",
    Icon: Sparkles,
    title: "Real-World Expertise",
    description:
      "Our instructors are active professionals, ensuring you learn the most current and relevant industry practices — not just theory.",
  },
  {
    id: 2,
    num: "02",
    Icon: Users,
    title: "Personalized Mentorship",
    description:
      "They provide individualized feedback and support, helping you overcome challenges, stay on track, and excel in your field.",
  },
  {
    id: 3,
    num: "03",
    Icon: Lightbulb,
    title: "Engaging & Practical Learning",
    description:
      "Lessons are designed to be interactive, with hands-on projects and real-world scenarios that build tangible, job-ready skills.",
  },
];

const InstructorPage = () => {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-prime-100 to-prime-200 text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-4">
            Our Team
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Learn from Industry&nbsp;
            <span className="text-indigo-200">Experts</span>
          </h1>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Our instructors are seasoned professionals dedicated to guiding
            you through every step of your learning journey at MATS Academy.
          </p>

          {/* Stats chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {[
              { num: "50+", label: "Expert Instructors" },
              { num: "10K+", label: "Students Taught" },
              { num: "500+", label: "Courses Delivered" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 flex items-center gap-2"
              >
                <span className="font-bold text-white">{s.num}</span>
                <span className="text-indigo-200 text-sm">{s.label}</span>
              </div>
            ))}
          </div>

          <Link href="/courses">
            <Button className="bg-white text-prime-100 hover:bg-gray-50 px-8 py-3 text-base font-semibold cursor-pointer">
              Explore Courses Taught by Experts
            </Button>
          </Link>
        </div>
      </section>

      {/* Instructor grid */}
      <TutorSection />

      {/* Teaching Philosophy */}
      <section className="bg-gray-900 py-20">
        <Wrapper>
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Our Approach
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Teaching Philosophy
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
              At MATS Academy, our instructors are more than just teachers —
              they are mentors committed to your success and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophyData.map((data) => (
              <div
                key={data.id}
                className="bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors duration-200 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="bg-indigo-500/20 rounded-xl p-3">
                    <data.Icon className="h-6 w-6 text-prime-50" />
                  </div>
                  <span className="text-4xl font-black text-gray-700 leading-none">
                    {data.num}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2">{data.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {data.description}
                </p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA */}
      <section className="bg-prime-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
            Choose from a wide range of courses taught by our exceptional
            instructors and take the next step in your career.
          </p>
          <Link href="/courses">
            <Button className="bg-white text-prime-100 hover:bg-gray-50 px-8 py-3 text-base font-semibold cursor-pointer">
              View All Courses
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default InstructorPage;
