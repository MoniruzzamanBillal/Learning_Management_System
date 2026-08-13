import Wrapper from "@/components/shared/Wrapper";
import {
  Cloud,
  Laptop,
  Link,
  Lock,
  Settings,
  Smartphone,
  Webcam,
} from "lucide-react";
import { ReactElement } from "react";
import ServiceCard from "./ServiceCard";

export type TService = {
  id: number;
  category: string;
  heading: string;
  icon: ReactElement;
};

const servicesData: TService[] = [
  {
    id: 1,
    category: "Web Development",
    heading:
      "Hands-on courses in modern web development using the latest tools and frameworks.",
    icon: <Webcam className="h-6 w-6" />,
  },
  {
    id: 2,
    category: "App Development",
    heading:
      "Learn to build responsive and powerful mobile apps for both Android and iOS.",
    icon: <Smartphone className="h-6 w-6" />,
  },
  {
    id: 3,
    category: "Software Development",
    heading:
      "Master software engineering concepts to build scalable and efficient applications.",
    icon: <Laptop className="h-6 w-6" />,
  },
  {
    id: 4,
    category: "Cybersecurity",
    heading:
      "Courses focused on real-world threats, ethical hacking, and securing systems.",
    icon: <Lock className="h-6 w-6" />,
  },
  {
    id: 5,
    category: "DevOps",
    heading:
      "Streamline development and deployment with practical DevOps tools and workflows.",
    icon: <Settings className="h-6 w-6" />,
  },
  {
    id: 6,
    category: "Cloud Computing",
    heading:
      "Understand cloud infrastructure and deploy scalable services using AWS, Azure & more.",
    icon: <Cloud className="h-6 w-6" />,
  },
  {
    id: 7,
    category: "Blockchain Development",
    heading:
      "Dive into blockchain fundamentals and build decentralized applications from scratch.",
    icon: <Link className="h-6 w-6" />,
  },
];

const Service = () => {
  return (
    <section className="bg-gray-50 py-16">
      <Wrapper>
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
            What We Offer
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            Delivering interactive &amp; skill-focused online learning across
            the most in-demand tech disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default Service;
