
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Is the content original and authentic?",
      answer: "Yes, every post is uniquely generated based on your input and chosen style. Our AI creates original content that reflects your voice and expertise, not copied text. Each post is tailored to your topic and professional background."
    },
    {
      question: "Can I edit the posts before sharing?",
      answer: "Absolutely! PostArc generates a foundation that you can edit, customize, and refine. Think of it as your expert writing assistant - it gives you a professional starting point that you can personalize to match your exact voice and message."
    },
    {
      question: "How does the AI understand different professional styles?",
      answer: "Our AI is trained on thousands of high-performing LinkedIn posts from consultants, founders, VCs, sales professionals, and HR leaders. It learns the unique tone, structure, and messaging patterns that resonate with each professional audience."
    },
    {
      question: "What happens to my data and content ideas?",
      answer: "Your privacy is our priority. We don't store your input topics or generated content permanently. Your ideas remain yours, and we use enterprise-grade security to protect all data. You can delete your account and data at any time."
    },
    {
      question: "How is this different from ChatGPT or other AI tools?",
      answer: "PostArc is specifically trained for LinkedIn content creation. Unlike general AI tools, we understand LinkedIn's unique format, professional tone, and engagement patterns. Our templates are optimized for each professional role, saving you time and improving results."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-midnight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate max-w-2xl mx-auto">
            Everything you need to know about creating content with PostArc
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-0"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-midnight hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate">
            Still have questions?{" "}
            <a 
              href="mailto:support@postarc.ai" 
              className="text-midnight hover:underline font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
