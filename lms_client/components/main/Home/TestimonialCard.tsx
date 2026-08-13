import Image from "next/image";
import { TTestimonial } from "./Testimonial";

type TTestimonialProps = {
  testimonial: TTestimonial;
};

const TestimonialCard = ({ testimonial }: TTestimonialProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm mx-4 mb-4 p-8 flex flex-col items-center text-center max-w-2xl mx-auto">
      {/* Large quote mark */}
      <span className="text-6xl text-indigo-100 font-serif leading-none select-none mb-2">
        &ldquo;
      </span>

      {/* Review text */}
      <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto mb-6">
        {testimonial.review}
      </p>

      {/* Avatar + name */}
      <div className="flex items-center justify-center gap-3">
        <div className="size-12 rounded-full overflow-hidden border-2 border-indigo-100 shrink-0">
          <Image
            height={96}
            width={96}
            src={testimonial.img}
            loading="lazy"
            alt={testimonial.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
