import {
  HeroSection,
  PopularCourse,
  Service,
  TutorSection,
} from "@/components/ui/Home";

const HomePage = () => {
  return (
    <div className="HomePageContainer">
      <HeroSection />
      <Service />
      <PopularCourse />
      <TutorSection />
    </div>
  );
};

export default HomePage;
