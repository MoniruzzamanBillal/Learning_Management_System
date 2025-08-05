import { Mail, MapPin, Phone } from "lucide-react";
import Wrapper from "../shared/Wrapper";

const ContactSection = () => {
  return (
    <section className="py-16 bg-teal-600 text-white">
      <Wrapper className="container mx-auto  text-center ">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Have questions or need support? Reach out to us directly via email or
          phone.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6" />
            <a
              href="mailto:support@devmats.com"
              className="text-white hover:underline"
            >
              support@devmats.com
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6" />
            <a href="tel:+1234567890" className="text-white hover:underline">
              +1 (234) 567-890
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6" />
            <span>123 Learning Lane, Tech City</span>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default ContactSection;
