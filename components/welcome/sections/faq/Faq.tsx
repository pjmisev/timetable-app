"use client";

import { Sparkles } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
// (Optional) keep your type if you want
import type { FAQItemProps } from "@/types";

const faqs: FAQItemProps[] = [
  {
    question: "Why was this app created?",
    answer:
      "Many students at Dundalk Institute of Technology have issues with the timetable app provided by the university. The app is not user friendly, and improvements are needed. I wanted to create a better alternative that would solve these issues.",
  },
  {
    question: "What are the issues with the original application?",
    answer:
      "The user interface is very outdated. The UI/UX is clunky and old-fashioned. It does not remember what department and class you're in. The class search is literal and you must know the exact name of your course. The timetable layouts provided are awkward and hard-to-read... etc.",
  },
  {
    question: "What technologies are used in this application?",
    answer:
      "The app is written in React, NextJS and data is stored in a MySQL database. Authentication is managed using AuthJS. The server is hosted on a privately owned VPS from Hetzner based in Amsterdam, Netherlands. The source code is available on GitHub.",
  },
  {
    question: "Any future plans for this application?",
    answer:
      "I'm hoping to add features as time goes on, such as customisable views, exporting timetables, etc. If the development team at Dundalk Institute of Technology are interested, I am always up for some teamwork and helping implement this app into their own systems. All of my source code is available on GitHub as linked above and can be inspected by anyone.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 dark:opacity-20" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-cyan-800/30 mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Commonly Asked{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700">
              Questions
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400">
            A quick answer to some of the most commonly asked questions about this app.
          </p>
        </div>

        {/* shadcn Accordion */}
        <Accordion
          type="single"
          collapsible
          className="max-w-3xl mx-auto divide-y rounded-lg border bg-background"
        >
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-4">
              <AccordionTrigger className="text-left text-base sm:text-lg py-4 cursor-pointer">
                <span className="text-2xl p-4 font-semibold">{faq.question}</span>
               
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-slate-600 dark:text-slate-300 px-4 pb-10">
                <span className="text-lg">{faq.answer}</span>
                
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
