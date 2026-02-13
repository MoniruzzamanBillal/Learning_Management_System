import ContactSection from "./ContactSection";
import FAQSection from "./FAQSection";
import FeaturesGrid from "./FeaturesGrid";
import HeroSection from "./HeroSection";
import PopularCourse from "./PopularCourse";
import Service from "./Service";
import StatsSection from "./StatsSection";
import Testimonial from "./Testimonial";
import TutorSection from "./TutorSection";

export default function HomePage() {
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
}
