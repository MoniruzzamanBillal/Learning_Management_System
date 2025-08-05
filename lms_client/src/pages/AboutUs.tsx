import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { GraduationCap, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";

const featuresData = [
  {
    id: 1,
    icon: <Lightbulb className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Industry-Relevant Curriculum",
    description:
      "Our courses are designed in collaboration with industry experts to ensure you learn the most in-demand skills and technologies.",
    bgColor: "bg-gray-100",
  },
  {
    id: 2,
    icon: <Users className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Expert Instructors",
    description:
      "Learn from seasoned professionals who bring real-world experience and insights into every lesson.",
    bgColor: "bg-gray-50",
  },
  {
    id: 3,
    icon: <GraduationCap className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Hands-On Learning",
    description:
      "Our practical approach emphasizes projects, assignments, and real-time feedback to solidify your skills.",
    bgColor: "bg-gray-50",
  },
];

const valuesData = [
  {
    id: 1,
    title: "Excellence",
    description:
      "Committed to delivering high-quality content and learning experiences.",
  },
  {
    id: 2,
    title: "Innovation",
    description: "Continuously evolving our curriculum and teaching methods.",
  },
  {
    id: 3,
    title: "Community",
    description: "Building a supportive network for learners and instructors.",
  },
];

const AboutUs = () => {
  return (
    <section className="py-10 bg-white">
      <Wrapper className="container mx-auto  ">
        <h2 className="text-3xl font-bold text-center mb-4 text-teal-600">
          About DevMats Academy
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          DevMats Academy is dedicated to empowering individuals with the skills
          needed to thrive in the rapidly evolving tech industry. We provide
          high-quality, interactive, and skill-focused online learning
          experiences.
        </p>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16  ">
          <div className="md:order-1  ">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Our Story: Empowering Futures
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              DevMats Academy was founded with a simple yet powerful idea: to
              make world-class tech education accessible to everyone, regardless
              of their background or location. We saw a growing demand for
              skilled professionals in the tech industry and a gap in
              traditional education. Our journey began with a small team of
              passionate educators and industry experts committed to creating a
              platform that delivers practical, job-ready skills.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Since then, we've grown into a thriving community, constantly
              evolving our curriculum and teaching methods to stay ahead of
              industry trends. We believe that continuous learning is the key to
              success in the digital age, and we're here to guide you every step
              of the way.
            </p>
          </div>

          <div className="md:order-2   ">
            <img
              src="https://i.postimg.cc/jjhn09qr/3778472.jpg"
              alt="Our Story Image"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to bridge the gap between academic knowledge and
              industry demands by offering practical, hands-on courses taught by
              experienced professionals. We aim to make cutting-edge tech
              education accessible to everyone, everywhere, fostering a new
              generation of skilled innovators.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We envision a future where continuous learning is seamless and
              impactful. DevMats strives to be the leading platform for skill
              development, fostering a global community of learners and
              innovators who are ready to tackle tomorrow's challenges and
              contribute meaningfully to the tech landscape.
            </p>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="mt-16 text-center mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            What Sets Us Apart
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData &&
              featuresData?.map((feature) => (
                <div
                  key={feature?.id}
                  className="p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-md flex flex-col items-center text-center"
                >
                  {feature?.icon}
                  <h4 className="text-xl font-bold text-teal-600 mb-2">
                    {feature?.title}
                  </h4>
                  <p className="text-gray-800 text-sm">
                    {feature?.description}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Our Core Values */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesData &&
              valuesData?.map((value) => (
                <div
                  key={value?.id}
                  className="p-6 bg-gray-100 rounded-md shadow-md border border-gray-200 "
                >
                  <h4 className="text-xl font-bold text-teal-600 mb-2">
                    {value?.title}
                  </h4>
                  <p className="text-gray-800 text-sm">{value?.description}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Ready to Advance Your Career?
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are transforming their careers with
            DevMats Academy. Explore our courses today and take the first step
            towards your future.
          </p>
          <Link to={"/courses"}>
            {" "}
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
              Explore Courses
            </Button>
          </Link>
        </div>
      </Wrapper>
    </section>
  );
};

export default AboutUs;
