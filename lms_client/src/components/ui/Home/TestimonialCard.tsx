import { TTestimonial } from "./Testimonial";

type TTestimonialProps = {
  testimonial: TTestimonial;
};

const TestimonialCard = ({ testimonial }: TTestimonialProps) => {
  return (
    <div className="TestimonialCardContainer">
      <div className="TestimonialCardWrapper">
        {/* card starts  */}
        <div className="bg-white py-8 ">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            {/* quote - start  */}
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <div className="max-w-md text-center text-gray-600 lg:text-lg">
                {testimonial?.review}
              </div>

              <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-100 shadow-lg md:h-14 md:w-14">
                  <img
                    src={testimonial?.img}
                    loading="lazy"
                    alt="Avatar Photo "
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div>
                  <div className="text-center text-sm font-bold text-indigo-500 sm:text-left md:text-base">
                    {testimonial?.name}
                  </div>
                </div>
              </div>
            </div>
            {/* quote - end  */}
          </div>
        </div>
        {/* card ends  */}
      </div>
    </div>
  );
};

export default TestimonialCard;
