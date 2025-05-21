import bannerImg from "@/assets/banner.png";
import Wrapper from "@/components/shared/Wrapper";

const HeroSection = () => {
  return (
    <div className="HeroSectionContainer">
      <Wrapper className="HeroSectionWrapper flex flex-col sm:flex-row justify-between items-start sm:items-center gap-x-3  ">
        {/* left section  */}
        <div className="leftSection w-full sm:w-[55%]  ">
          <div className="headingSection text-3xl xsm:text-4xl sm:text-3xl xmd:text-4xl lg:text-5xl   font-semibold flex flex-col gap-y-3 ">
            <p>
              Up Your <span className=" text-prime50 font-bold ">Skills</span>
            </p>
            <p>
              To <span className=" text-prime50 font-bold ">Advance</span> your
            </p>
            <p>
              <span className=" text-prime50 font-bold ">Career</span> Path
            </p>
          </div>

          <p className="  mt-6 lg:mt-8 text-lg sm:text-base lg:text-lg w-full md:w-[92%] xmd:w-[85%] lg:w-[70%]  ">
            Master Web Development, App Development, Cybersecurity, UI/UX, and
            more with expert-led video lessons and real-time progress tracking —
            learn job-ready skills anytime, anywhere.
          </p>
        </div>

        {/*  */}

        {/* right section  */}
        <div className="rightSection w-full sm:w-[45%]">
          <div className="imgSection">
            <img src={bannerImg} alt="" />
          </div>
        </div>

        {/*  */}
      </Wrapper>
    </div>
  );
};

export default HeroSection;
