import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Users } from "lucide-react";
import Link from "next/link";
import FAQSection from "./FAQSection";

const quickLinks = [
  {
    id: 1,
    Icon: BookOpen,
    title: "Explore Courses",
    description: "Browse our full catalog of tech courses.",
    buttonText: "View Courses",
    link: "/courses",
  },
  {
    id: 2,
    Icon: Users,
    title: "Meet Our Instructors",
    description: "Learn from industry-leading experts.",
    buttonText: "Our Team",
    link: "/instructors",
  },
  {
    id: 3,
    Icon: Mail,
    title: "Direct Support",
    description: "Can't find your answer? Contact us directly.",
    buttonText: "Get Support",
    link: "/contact",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-prime-100 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-4">
            Help Center
          </p>
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
            Find quick answers to the most common questions about MATS Academy,
            our courses, and platform.
          </p>
          {/* Quick nav chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Certificates", "Pricing", "Mobile Access", "Support", "Updates"].map(
              (topic) => (
                <span
                  key={topic}
                  className="bg-white/10 border border-white/20 text-indigo-100 text-xs px-4 py-1.5 rounded-full backdrop-blur-sm"
                >
                  {topic}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ body — two-col on desktop */}
      <section className="bg-white py-16">
        <Wrapper>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 text-sm mb-10 text-center max-w-2xl mx-auto">
              We&apos;ve compiled answers to the most common inquiries. If you
              can&apos;t find what you&apos;re looking for, our support team is
              always happy to help.
            </p>
            <FAQSection />
          </div>
        </Wrapper>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-50 py-16">
        <Wrapper>
          <div className="text-center mb-12">
            <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
              Quick Links
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Resources &amp; Support
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickLinks.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className="bg-indigo-50 group-hover:bg-prime-100 rounded-xl p-4 w-fit mb-4 transition-colors duration-200">
                  <item.Icon className="h-6 w-6 text-prime-100 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  {item.description}
                </p>
                <Link href={item.link} className="mt-auto">
                  <Button
                    variant="outline"
                    className="border-prime-100 text-prime-100 hover:bg-indigo-50 bg-transparent cursor-pointer"
                  >
                    {item.buttonText}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            If you couldn&apos;t find the answer you were looking for, our
            support team is here to help within 24 hours.
          </p>
          <Link href="/contact">
            <Button className="bg-prime-100 hover:bg-prime-200 text-white px-8 py-3 text-base font-semibold cursor-pointer">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
