import { FeaturesGrid, StatsSection } from "@/components/ui";
import {
  HeroSection,
  PopularCourse,
  Service,
  Testimonial,
  TutorSection,
} from "@/components/ui/Home";

const HomePage = () => {
  return (
    <div className="HomePageContainer">
      <HeroSection />
      <Service />
      <PopularCourse />
      <StatsSection />

      <TutorSection />
      <FeaturesGrid />
      <Testimonial />
    </div>
  );
};

export default HomePage;
