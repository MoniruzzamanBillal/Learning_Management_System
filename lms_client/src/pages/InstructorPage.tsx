import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { TutorSection } from "@/components/ui/Home";
import { Lightbulb, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

const instructorCardsData = [
  {
    id: 1,
    icon: <Sparkles className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Real-World Expertise",
    description:
      "Our instructors are active professionals, ensuring you learn the most current and relevant industry practices.",
  },
  {
    id: 2,
    icon: <Users className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Personalized Mentorship",
    description:
      "They provide individualized feedback and support, helping you overcome challenges and excel.",
  },
  {
    id: 3,
    icon: <Lightbulb className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Engaging & Practical Learning",
    description:
      "Lessons are designed to be interactive, with hands-on projects that build tangible skills.",
  },
];

const InstructorPage = () => {
  return (
    <main className="min-h-screen  ">
      <section className="bg-teal-600 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Learn from the Best: Our Expert Instructors
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Meet the industry leaders and seasoned professionals who are
            dedicated to guiding you through your learning journey at DevMats
            Academy.
          </p>
          <Link to="/courses">
            <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Explore Courses Taught by Experts
            </Button>
          </Link>
        </div>
      </section>
      <TutorSection />
      <section className="py-16 bg-gray-50">
        <Wrapper className=" mx-auto  text-center ">
          <h2 className="text-3xl font-bold mb-6 text-teal-600">
            Our Teaching Philosophy
          </h2>
          <p className="text-lg text-gray-800 mb-12 max-w-3xl mx-auto">
            At DevMats Academy, our instructors are more than just teachers;
            they are mentors committed to your success. They bring real-world
            experience, practical insights, and a passion for education to every
            lesson.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {instructorCardsData &&
              instructorCardsData?.map((data) => (
                <div
                  key={data?.id}
                  className="bg-gray-100 border border-gray-300 p-6 rounded-md shadow-md flex flex-col items-center text-center"
                >
                  {data?.icon}
                  <h3 className="text-xl font-semibold mb-2">{data?.title}</h3>
                  <p className="text-gray-600 text-sm">{data?.description}</p>
                </div>
              ))}
          </div>
        </Wrapper>
      </section>
      <section className="py-16 bg-gray-100 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-teal-600">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Choose from a wide range of courses taught by our exceptional
            instructors and take the next step in your career.
          </p>
          <Link to="/courses">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
              View All Courses
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default InstructorPage;
