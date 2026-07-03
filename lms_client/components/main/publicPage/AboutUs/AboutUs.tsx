import Wrapper from "@/components/shared/Wrapper";
import { Button } from "@/components/ui/button";
import { GraduationCap, Lightbulb, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { number: "10K+", label: "Students Enrolled" },
  { number: "500+", label: "Courses Completed" },
  { number: "50+", label: "Expert Instructors" },
  { number: "98%", label: "Satisfaction Rate" },
];

const featuresData = [
  {
    id: 1,
    num: "01",
    Icon: Lightbulb,
    title: "Industry-Relevant Curriculum",
    description:
      "Our courses are designed in collaboration with industry experts to ensure you learn the most in-demand skills and technologies.",
  },
  {
    id: 2,
    num: "02",
    Icon: Users,
    title: "Expert Instructors",
    description:
      "Learn from seasoned professionals who bring real-world experience and insights into every lesson.",
  },
  {
    id: 3,
    num: "03",
    Icon: GraduationCap,
    title: "Hands-On Learning",
    description:
      "Our practical approach emphasizes projects, assignments, and real-time feedback to solidify your skills.",
  },
];

const valuesData = [
  {
    id: 1,
    emoji: "🏆",
    title: "Excellence",
    description:
      "Committed to delivering high-quality content and learning experiences that genuinely transform careers.",
  },
  {
    id: 2,
    emoji: "💡",
    title: "Innovation",
    description:
      "Continuously evolving our curriculum and teaching methods to stay ahead of industry trends.",
  },
  {
    id: 3,
    emoji: "🤝",
    title: "Community",
    description:
      "Building a supportive global network where learners and instructors grow together.",
  },
];

const AboutUs = () => {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-prime-100 to-prime-200 text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-4">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Empowering the Next Generation
            <br />
            <span className="text-indigo-200">of Tech Professionals</span>
          </h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto leading-relaxed">
            MATS Academy delivers practical, skill-focused online learning for
            the rapidly evolving tech industry.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <Wrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat) => (
              <div key={stat.label} className="py-8 text-center px-4">
                <p className="text-3xl font-bold text-prime-100 mb-1">
                  {stat.number}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* Our Story */}
      <section className="bg-gray-50 py-20">
        <Wrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="order-2 md:order-1 relative">
              <Image
                src="https://i.postimg.cc/jjhn09qr/3778472.jpg"
                alt="Our Story"
                height={800}
                width={800}
                className="rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-prime-100 text-white rounded-2xl px-5 py-3 shadow-lg hidden md:block">
                <p className="text-2xl font-bold">5+</p>
                <p className="text-indigo-200 text-xs">Years of Impact</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
                Our Story
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                A Platform Built
                <br />
                Around Real Learning
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                MATS Academy was founded with a simple yet powerful idea: to
                make world-class tech education accessible to everyone,
                regardless of their background or location. We saw a growing
                demand for skilled professionals and a gap in traditional
                education.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Since then, we&apos;ve grown into a thriving community,
                constantly evolving our curriculum and teaching methods to stay
                ahead of industry trends. Continuous learning is the key to
                success in the digital age — and we&apos;re here every step of
                the way.
              </p>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Mission / Vision */}
      <section className="py-20">
        <Wrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission — dark indigo */}
            <div className="bg-prime-100 text-white rounded-2xl p-8">
              <p className="text-indigo-200 text-xs font-semibold tracking-widest uppercase mb-3">
                Mission
              </p>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-indigo-200 leading-relaxed text-sm">
                To bridge the gap between academic knowledge and industry
                demands by offering practical, hands-on courses taught by
                experienced professionals — making cutting-edge tech education
                accessible to everyone, everywhere.
              </p>
            </div>

            {/* Vision — light */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
              <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
                Vision
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                A future where continuous learning is seamless and impactful.
                MATS Academy strives to be the leading platform for skill
                development, fostering a global community of learners ready to
                tackle tomorrow&apos;s challenges.
              </p>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* What Sets Us Apart */}
      <section className="bg-gray-50 py-20">
        <Wrapper>
          <div className="text-center mb-12">
            <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
              Our Advantage
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuresData.map((feature) => (
              <div
                key={feature.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <feature.Icon className="h-6 w-6 text-prime-100" />
                  </div>
                  <span className="text-4xl font-black text-gray-100 leading-none">
                    {feature.num}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* Core Values — dark section */}
      <section className="bg-gray-900 py-20">
        <Wrapper>
          <div className="text-center mb-12">
            <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl font-bold text-white">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {valuesData.map((value) => (
              <div
                key={value.id}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors duration-200"
              >
                <p className="text-4xl mb-4">{value.emoji}</p>
                <h4 className="font-bold text-white text-lg mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA */}
      <section className="bg-prime-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h3>
          <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students transforming their careers with MATS
            Academy. Take the first step today.
          </p>
          <Link href="/courses">
            <Button className="bg-white text-prime-100 hover:bg-gray-50 px-8 py-3 text-base font-semibold cursor-pointer">
              Explore Courses
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
