import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import type { AnimatedProps } from "@/types/motion";
import { GraduationCap, School } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";

export async function Hero({ id }: AnimatedProps) {
  const session = await auth();

  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      <div className="relative w-full max-w-4xl mx-auto text-center px-4">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 pb-2 fade-in-bottom">
            Class Timetable
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full fade-in-bottom"></div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-8 w-full max-w-2xl mx-auto mt-8 sm:mt-12 fade-in-bottom-02s">
          Class timetables are currently unavailable. Please check back later.
        </p>
      </div>
    </section>
  );
}
