import Wrapper from "@/components/shared/Wrapper";
import { Mail, MapPin, Phone } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "support@matsacademy.com",
    href: "mailto:support@matsacademy.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (234) 567-890",
    href: "tel:+1234567890",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Learning Lane, Tech City",
    href: null,
  },
];

const ContactSection = () => {
  return (
    <section className="bg-gray-900 py-16 text-white">
      <Wrapper>
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Get in Touch</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base">
            Have questions or need support? Reach out to us — we&apos;re happy
            to help.
          </p>
        </div>

        {/* Contact cards */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-5 max-w-3xl mx-auto">
          {contacts.map((contact) => (
            <div
              key={contact.label}
              className="flex-1 bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-colors rounded-xl p-6 flex flex-col items-center gap-3 text-center"
            >
              {/* Icon */}
              <div className="bg-indigo-500/20 rounded-lg p-3">
                <contact.icon className="h-5 w-5 text-prime-50" />
              </div>

              {/* Label */}
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                {contact.label}
              </p>

              {/* Value */}
              {contact.href ? (
                <a
                  href={contact.href}
                  className="text-white font-medium text-sm hover:text-prime-50 transition-colors"
                >
                  {contact.value}
                </a>
              ) : (
                <span className="text-white font-medium text-sm">
                  {contact.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default ContactSection;
