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
    img: "https://res.cloudinary.com/dupxfufq9/image/upload/v1747106241/Musaddikul%20Islam%20Sakib.jpg",
  },
  {
    review:
      "The Web Development course exceeded my expectations. The instructors were top-notch and I loved the hands-on projects. I feel more confident applying for developer jobs now.",
    name: "Ismail Hania",
    img: "https://i.ibb.co/FxHzzq7/images.jpg",
  },
  {
    review:
      "The course dashboard is very intuitive. I loved how each video unlocks as I make progress. It kept me motivated to complete the modules!",
    name: "Mahfuz ahmed",
    img: "https://res.cloudinary.com/dupxfufq9/image/upload/v1747464740/Mahfuz%20ahmed.png",
  },
  {
    review:
      "Enrolling in the Cybersecurity course was one of my best decisions. The real-world use cases and practical labs helped me gain strong foundational skills.",
    name: "Obaidul Hasan",
    img: "https://res.cloudinary.com/dupxfufq9/image/upload/v1747464765/Obaidul%20Hasan.jpg",
  },
  {
    review:
      "What I love most is the flexibility. I can learn at my own pace, revisit videos, and even track which ones I’ve completed. Truly a learner-friendly platform!",
    name: "Rabbi",
    img: "https://res.cloudinary.com/dupxfufq9/image/upload/v1747464786/Rabbi.jpg.jpg",
  },
];

const Testimonial = () => {
  return (
    <div className="TestimonialContainer bg-gray-50 py-8 ">
      <Wrapper className=" TestimonialWrapper">
        <h1 className="  text-center font-semibold text-prime100   ">
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
                  {/* testimonial starts  */}
                  <TestimonialCard testimonial={testimonial} />
                  {/* testimonial ends  */}
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
