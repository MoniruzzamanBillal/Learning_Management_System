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
      <TutorSection />
      <Testimonial />
    </div>
  );
};

export default HomePage;
