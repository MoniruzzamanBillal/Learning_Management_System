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
    icon: <Webcam className=" size-8 " />,
  },

  {
    id: 2,
    category: "App Development",
    heading:
      "Learn to build responsive and powerful mobile apps for both Android and iOS.",
    icon: <Smartphone className=" size-8 " />,
  },

  {
    id: 3,
    category: "Software Development",
    heading:
      "Master software engineering concepts to build scalable and efficient applications.",
    icon: <Laptop className="  size-8 " />,
  },
  {
    id: 4,
    category: "Cybersecurity",
    heading:
      "Courses focused on real-world threats, ethical hacking, and securing systems.",
    icon: <Lock className="  size-8 " />,
  },
  {
    id: 5,
    category: "DevOps",
    heading:
      "Streamline development and deployment with practical DevOps tools and workflows.",
    icon: <Settings className="  size-8 " />,
  },
  {
    id: 6,
    category: "Cloud Computing",
    heading:
      "Understand cloud infrastructure and deploy scalable services using AWS, Azure & more.",
    icon: <Cloud className="  size-8" />,
  },
  {
    id: 7,
    category: " Blockchain Development",
    heading:
      "Dive into blockchain fundamentals and build decentralized applications from scratch.",
    icon: <Link className="  size-8 " />,
  },
];

const Service = () => {
  return (
    <div className="ServiceContainer py-8 bg-gray-100 ">
      <Wrapper className="ServiceWrapper">
        <h1 className=" text-center ">Our Services</h1>
        <h2 className=" text-center pt-4 font-medium ">
          Delivering Interactive & Skill-Focused Online Learning
        </h2>

        <div className="servicesSection pt-8 grid grid-cols-3 gap-4 ">
          {servicesData &&
            servicesData?.map((service: TService) => (
              <ServiceCard service={service} />
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default Service;
