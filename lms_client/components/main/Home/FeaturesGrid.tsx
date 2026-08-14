import Wrapper from "@/components/shared/Wrapper";
import { Award, CheckCircle, MessageSquare, PlayCircle } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Course Progress Tracking",
    description:
      "Monitor your learning journey with real-time progress indicators for every course and module.",
  },
  {
    icon: Award,
    title: "Certificate Generation",
    description:
      "Earn verifiable certificates upon successful course completion to showcase your skills.",
  },
  {
    icon: PlayCircle,
    title: "Expert-Led Video Lessons",
    description:
      "Learn from industry professionals through high-quality video content at your own pace.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Instructor Feedback",
    description:
      "Get personalized guidance and support directly from your instructors whenever you need it.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="bg-white py-16">
      <Wrapper>
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            Discover the core features that make MATS Academy the ideal platform
            for your learning journey.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Icon container */}
              <div className="bg-indigo-50 rounded-lg p-3 shrink-0">
                <feature.icon className="h-6 w-6 text-prime-100" />
              </div>
              {/* Text */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default FeaturesGrid;
