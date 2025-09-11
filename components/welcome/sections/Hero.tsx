"use client";

import { Button } from "@/components/ui/button";
import type { AnimatedProps } from "@/types/motion";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function Hero({ id }: AnimatedProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      <div className="relative w-full max-w-4xl mx-auto text-center px-4">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 pb-2 fade-in-bottom">
            Timetable App
            <br />
            by PJmisev
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full fade-in-bottom"></div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-8 w-full max-w-2xl mx-auto mt-8 sm:mt-12 fade-in-bottom-05s">
          A free, easy to use, better designed alternative to the timetable app
          provided at everyone's favourite Louth university ;)
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative fade-in-bottom-10s">
          <div className="w-full sm:w-auto">
            <Link href="/login">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-foreground via-foreground to-foreground/90 text-background hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </Link>
          </div>
          <div className="w-full sm:w-auto">
            <Link
              href="https://github.com/pjmisev/timetable-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-foreground/20 text-foreground hover:bg-foreground/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/auth/github.svg"
                    height={20}
                    width={20}
                    alt="Github Logo"
                    className="w-5 h-5"
                  />
                  <span>Source Code</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
