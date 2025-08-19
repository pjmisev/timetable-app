"use client";

import { Sparkles } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
// (Optional) keep your type if you want
import type { FAQItemProps } from "@/types";

const faqs: FAQItemProps[] = [
  {
    question: "What is the point of this application?",
    answer:
      "Personally, I feel disappointed by the lack of effort put into our university's timetable app, so I decided to reverse engineer it and make my own, and most importantly make it better. Also I was just bored.",
  },
  {
    question: "What is wrong with the original application?",
    answer:
      "The user interface is straight from 1999. The user experience is terrible. It doesn't remember what department and class you're in. When you do generate the timetable, the list layout is ugly, and grid view is cluttered.",
  },
  {
    question: "What technologies are used in this application?",
    answer:
      "The app is written in React, NextJS and the data is stored in an SQLite database. Authentication is managed by Auth JS. The server is hosted on a privately owned VPS from Hetzner.",
  },
  {
    question: "Any future plans for this application?",
    answer:
      "I'm hoping to add features as time goes on, such as customisable views, exporting timetables, etc. If the university staff are interested, I am always up for a bit of teamwork and helping implement this app into their own systems. All of my source code is available on GitHub as linked above and can be inspected by anyone.",
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
            Questions That{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700">
              Nobody Asked
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400">
            But here they are anyway.
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
