import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import MapContainer from "./MapContainer";

const contactItems = [
  {
    Icon: Mail,
    label: "Email Us",
    value: "support@matsacademy.com",
    sub: "We reply within 24 hours",
    href: "mailto:support@matsacademy.com",
  },
  {
    Icon: Phone,
    label: "Call Us",
    value: "+1 (234) 567-890",
    sub: "Mon–Fri, 9 AM – 5 PM EST",
    href: "tel:+1234567890",
  },
  {
    Icon: MapPin,
    label: "Visit Us",
    value: "123 Learning Lane, Tech City",
    sub: "Suite 100, TC 12345",
    href: null,
  },
  {
    Icon: Clock,
    label: "Office Hours",
    value: "Mon – Fri",
    sub: "9:00 AM – 5:00 PM (EST)",
    href: null,
  },
];

export default function ContactUs() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-prime-100 to-prime-200 text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-4">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            We&apos;d Love to Hear{" "}
            <span className="text-indigo-200">From You</span>
          </h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-10">
            Have a question, feedback, or need support? Reach out — our team is
            ready to help you.
          </p>
          <Link href="mailto:support@matsacademy.com">
            <Button className="bg-white text-prime-100 hover:bg-gray-50 px-8 py-3 text-base font-semibold cursor-pointer">
              Send Us an Email
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact info grid */}
      <section className="bg-white py-16">
        <Wrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
              >
                <div className="bg-indigo-50 group-hover:bg-prime-100 rounded-xl p-3 w-fit mb-4 transition-colors duration-200">
                  <item.Icon className="h-5 w-5 text-prime-100 group-hover:text-white transition-colors duration-200" />
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-semibold text-gray-900 hover:text-prime-100 transition-colors text-sm block mb-1"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    {item.value}
                  </p>
                )}
                <p className="text-gray-400 text-xs">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <MapContainer />
          </div>
        </Wrapper>
      </section>

      {/* CTA strip */}
      <section className="bg-gray-900 py-12">
        <Wrapper>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Still need help?
              </h3>
              <p className="text-gray-400 text-sm">
                Browse our FAQ page for quick answers to common questions.
              </p>
            </div>
            <Link href="/faqs" className="shrink-0">
              <Button className="bg-prime-100 hover:bg-prime-200 text-white px-6 cursor-pointer">
                View FAQ
              </Button>
            </Link>
          </div>
        </Wrapper>
      </section>
    </main>
  );
}
