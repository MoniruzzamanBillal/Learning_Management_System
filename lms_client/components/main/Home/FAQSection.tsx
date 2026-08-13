import Wrapper from "@/components/shared/Wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I get a certificate upon course completion?",
    answer:
      "Yes, upon successful completion of most courses, you will receive a verifiable digital certificate that you can share on LinkedIn or add to your portfolio.",
  },
  {
    question: "Are the courses free?",
    answer:
      "MATS Academy offers a mix of free introductory courses and premium paid courses. You can check each course's details page for pricing information.",
  },
  {
    question: "Can I access this on mobile?",
    answer:
      "MATS Academy is fully responsive and optimized for mobile devices, allowing you to learn on the go from any smartphone or tablet.",
  },
  {
    question: "What kind of support is available?",
    answer:
      "We offer email support, a comprehensive help center, and for premium courses, real-time instructor feedback and community forums.",
  },
  {
    question: "How often are new courses added?",
    answer:
      "We regularly update our course catalog with new and trending topics to ensure you always have access to the latest in-demand skills.",
  },
];

const FAQSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <Wrapper>
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-prime-50 text-xs font-semibold tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            Find answers to common questions about MATS Academy and our
            learning platform.
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-xl overflow-hidden px-2 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 text-base py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Wrapper>
    </section>
  );
};

export default FAQSection;
