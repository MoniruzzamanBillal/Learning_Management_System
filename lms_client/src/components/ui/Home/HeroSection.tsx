import bannerImg from "@/assets/banner.png";
import Wrapper from "@/components/shared/Wrapper";

const HeroSection = () => {
  return (
    <div className="HeroSectionContainer">
      <Wrapper className="HeroSectionWrapper flex justify-between items-center gap-x-3  ">
        {/* left section  */}
        <div className="leftSection w-[55%] ">
          <div className="headingSection text-5xl   font-semibold flex flex-col gap-y-3 ">
            <p>
              Up Your <span className=" text-prime50 font-bold ">Skills</span>
            </p>
            <p>
              To <span className=" text-prime50 font-bold ">Advance</span> your
            </p>
            <p>
              {" "}
              <span className=" text-prime50 font-bold ">Career</span> Path
            </p>
          </div>

          <p className=" pt-8 text-lg w-[70%]  ">
            Master Web Development, App Development, Cybersecurity, UI/UX, and
            more with expert-led video lessons and real-time progress tracking —
            learn job-ready skills anytime, anywhere.
          </p>
        </div>

        {/*  */}

        {/* right section  */}
        <div className="rightSection w-[45%]">
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
