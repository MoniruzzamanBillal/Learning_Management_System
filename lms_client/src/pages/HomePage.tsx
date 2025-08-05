import {
  ContactSection,
  FAQSection,
  FeaturesGrid,
  StatsSection,
} from "@/components/ui";
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
      <FAQSection />
      <Testimonial />
      <ContactSection />
    </div>
  );
};

export default HomePage;
