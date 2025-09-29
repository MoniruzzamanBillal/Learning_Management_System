import Wrapper from "@/components/shared/Wrapper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import TestimonialCard from "./TestimonialCard";

export type TTestimonial = {
  review: string;
  name: string;
  img: string;
};

const testimonialData: TTestimonial[] = [
  {
    review:
      "This platform made learning so much easier! The video lessons are clear, well-structured, and I could track my progress seamlessly. Highly recommended for anyone serious about upskilling.",
    name: "Abul Hasan",
    img: "https://i.postimg.cc/kGzbs8Jq/515439020-2147819785682162-260233122788938226-n.jpg",
  },
  {
    review:
      "The Web Development course exceeded my expectations. The instructors were top-notch and I loved the hands-on projects. I feel more confident applying for developer jobs now.",
    name: "Ismail Hania",
    img: "https://i.postimg.cc/yNR75bmx/504088512-4181158668874712-5104357887335128166-n.jpg",
  },
  {
    review:
      "The course dashboard is very intuitive. I loved how each video unlocks as I make progress. It kept me motivated to complete the modules!",
    name: "Mahfuz ahmed",
    img: "https://i.postimg.cc/8cJF75hY/425321265-122100582938203050-1203191898968956264-n.jpg",
  },
  {
    review:
      "Enrolling in the Cybersecurity course was one of my best decisions. The real-world use cases and practical labs helped me gain strong foundational skills.",
    name: "Obaidul Hasan",
    img: "https://i.postimg.cc/26JF63q3/118776616-2682016592038358-33323368280966418-n.jpg",
  },
  {
    review:
      "What I love most is the flexibility. I can learn at my own pace, revisit videos, and even track which ones I’ve completed. Truly a learner-friendly platform!",
    name: "Md Mahmudul Hasan",
    img: "https://i.postimg.cc/MThVw445/499168714-1465365904628987-4897850097428601686-n.jpg",
  },
  {
    review:
      "The React Native course was exactly what I needed. The step-by-step guidance and practical projects helped me build my first cross-platform app with confidence.",
    name: "Tanvirul Haque Prottoy",
    img: "https://i.postimg.cc/1t422nhy/481675488-942284284736543-8872097060163243105-n.jpg",
  },
  {
    review:
      "I never thought online learning could feel this engaging. The quizzes, structured modules, and community support kept me motivated till the very end.",
    name: "Jubaer Ahamed Bhuiyan",
    img: "https://i.postimg.cc/Qxg46kKD/54521483-394082101170981-1515656545298284544-n.jpg",
  },
];

const Testimonial = () => {
  return (
    <div className="TestimonialContainer bg-gray-50 py-8 ">
      <Wrapper className=" TestimonialWrapper">
        <h1 className="  text-center font-semibold text-prime100  text-xl xsm:text-2xl md:text-3xl  ">
          What others say about us
        </h1>

        <div className="testimonialCardContainer">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            // navigation={true}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            {testimonialData &&
              testimonialData?.map((testimonial: TTestimonial, ind: number) => (
                <SwiperSlide key={ind}>
                  <TestimonialCard testimonial={testimonial} />
                </SwiperSlide>
              ))}

            {/*  */}

            {/*  */}
          </Swiper>
        </div>
      </Wrapper>
    </div>
  );
};

export default Testimonial;
