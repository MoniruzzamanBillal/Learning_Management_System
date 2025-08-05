import {
  Award,
  CheckCircle,
  Folder,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";
import Wrapper from "../shared/Wrapper";

const features = [
  {
    icon: CheckCircle,
    title: "Course Progress Tracking",
    description:
      "Monitor your learning journey and track your progress effortlessly.",
  },
  {
    icon: Target,
    title: "Quiz & Assignment System",
    description:
      "Test your knowledge with interactive quizzes and challenging assignments.",
  },
  {
    icon: Award,
    title: "Certificate Generation",
    description:
      "Earn verifiable certificates upon successful course completion.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Instructor Feedback",
    description: "Get personalized feedback and support from your instructors.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Gain insights into your learning performance and areas for improvement.",
  },
  {
    icon: Folder,
    title: "File & Resource Sharing",
    description:
      "Access and share course materials, notes, and additional resources.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-16 bg-white  ">
      <Wrapper className="container mx-auto   ">
        <h2 className="text-3xl font-bold text-center mb-4 text-teal-600">
          Why Choose DevMats?
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover the core features that make DevMats the ideal platform for
          your learning needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-md flex items-start space-x-4"
            >
              <feature.icon className="h-8 w-8 text-teal-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default FeaturesGrid;
