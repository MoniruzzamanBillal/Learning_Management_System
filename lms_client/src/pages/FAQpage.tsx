import Wrapper from "@/components/shared/Wrapper";
import { FAQSection } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";

const cardsData = [
  {
    id: 1,
    icon: <BookOpen className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Explore Courses",
    description: "Browse our full catalog of tech courses.",
    buttonText: "View Courses",
    link: "/courses",
  },
  {
    id: 2,
    icon: <Users className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Meet Our Instructors",
    description: "Learn from industry-leading experts.",
    buttonText: "Our Team",
    link: "/instructors",
  },
  {
    id: 3,
    icon: <Mail className="h-10 w-10 text-teal-600 mb-4" />,
    title: "Direct Support",
    description: "Can't find your answer? Contact us directly.",
    buttonText: "Get Support",
    link: "/contact",
  },
];

const FAQpage = () => {
  return (
    <main className="min-h-screen  ">
      {" "}
      {/* heading section  */}
      <section className="bg-teal-600 text-white py-16 text-center">
        <div className="  mx-auto   ">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Find quick answers to the most common questions about DevMats
            Academy, our courses, and platform.
          </p>
        </div>
      </section>
      {/* 2nd text section  */}
      <section className="py-12 bg-white">
        <Wrapper className="  ">
          <p className="text-xl text-gray-800 mb-10 text-center">
            We've compiled a list of common inquiries to help you navigate your
            learning journey with ease. If you can't find what you're looking
            for, don't hesitate to reach out to our support team.
          </p>
          <FAQSection />
        </Wrapper>
      </section>
      <section className="py-16 bg-gray-50">
        <Wrapper className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-teal-600">
            Quick Links & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cardsData &&
              cardsData?.map((cardItem) => (
                <div
                  key={cardItem?.id}
                  className="bg-gray-100 border border-gray-300 p-6 rounded-md shadow-md flex flex-col items-center"
                >
                  {cardItem?.icon}
                  <h3 className="text-xl font-semibold mb-2">
                    {" "}
                    {cardItem?.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {cardItem?.description}
                  </p>
                  <Link to={cardItem?.link}>
                    <Button
                      variant="outline"
                      className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent"
                    >
                      {cardItem?.buttonText}
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </Wrapper>
      </section>
      <section className="py-16 bg-gray-100 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-teal-600">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            If you couldn't find the answer you were looking for, our support
            team is here to help.
          </p>
          <Link to="/contact">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default FAQpage;
