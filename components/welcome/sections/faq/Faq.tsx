"use client";

import { FAQItem } from "@/components/main/sections/faq/FaqItem";
import type { FAQItemProps } from "@/types";
import type { AnimatedProps } from "@/types/motion";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const faqs: FAQItemProps[] = [
  {
    category: "General",
    question: "What is the point of this application?",
    answer:
      "Personally, I feel disappointed by the lack of effort put into our university's timetable app, so I decided to reverse engineer it and make my own, and most importantly make it better. Also I was just bored.",
  },
  {
    category: "General",
    question: "What is wrong with the original application?",
    answer:
      "The user interface is straight from 1999. The user experience is terrible. It doesn't remember what department and class you're in. When you do generate the timetable, the list layout is ugly, and grid view is cluttered.",
  },
  {
    category: "Technical",
    question: "What technologies are used in this application?",
    answer:
      "The app is written in React, NextJS and the data is stored in an SQLite database. Authentication is managed by Auth JS. The server is hosted on a privately owned VPS from Hetzner.",
  },
  {
    category: "Future",
    question: "Any future plans for this application?",
    answer:
      "I'm hoping to add features as time goes on, such as customisable views, exporting timetables, etc. If the university staff are interested, I am always up for a bit of teamwork and helping implement this app into their own systems. All of my source code is available on GitHub as linked above and can be inspected by anyone.",
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export function FAQ({ id }: AnimatedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <section id={id} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 opacity-10 dark:opacity-20" />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-cyan-800/30 mx-auto mb-4"
              initial={{ rotate: -15 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Questions That{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700">
              Nobody Asked
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            But here they are anyway.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delayChildren: 0.2 }}
        >
          <motion.button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div layout className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
