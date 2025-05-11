import { HeroSection, PopularCourse, Service } from "@/components/ui/Home";

const HomePage = () => {
  return (
    <div className="HomePageContainer">
      <HeroSection />
      <Service />
      <PopularCourse />
    </div>
  );
};

export default HomePage;
