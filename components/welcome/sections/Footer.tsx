"use client";

import { motion } from "motion/react";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" />
      </div>
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <img
              className="h-15 pb-5 block dark:hidden mx-auto"
              src="/img/logo/Timetables_Logo_Black.png"
            ></img>

            <img
              className="h-15 pb-5 hidden dark:block mx-auto"
              src="/img/logo/Timetables_Logo_White.png"
            ></img>
            <div className="relative h-px mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Pijus Misevicius
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
