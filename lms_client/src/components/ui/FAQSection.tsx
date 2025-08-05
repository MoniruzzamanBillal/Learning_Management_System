import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Wrapper from "../shared/Wrapper";

const faqs = [
  {
    question: "Can I get a certificate upon course completion?",
    answer:
      "Yes, upon successful completion of most courses, you will receive a verifiable digital certificate.",
  },
  {
    question: "Are the courses free?",
    answer:
      "DevMats offers a mix of free introductory courses and premium paid courses. You can check each course's details for pricing information.",
  },
  {
    question: "Can I access this on mobile?",
    answer:
      "DevMats is fully responsive and optimized for mobile devices, allowing you to learn on the go.",
  },
  {
    question: "What kind of support is available?",
    answer:
      "We offer email support, a comprehensive help center, and for premium courses, real-time instructor feedback and community forums.",
  },
  {
    question: "How often are new courses added?",
    answer:
      "We regularly update our course catalog with new and trending topics to ensure you always have access to the latest skills.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 bg-gray-100 ">
      <Wrapper className="container mx-auto  ">
        <h2 className="text-3xl font-bold text-center mb-4 text-teal-600">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Find answers to common questions about DevMats and our learning
          platform.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-800">
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
