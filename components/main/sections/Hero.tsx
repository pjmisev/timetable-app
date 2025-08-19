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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-emerald-500/30 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-emerald-500/20 rounded-full blur-3xl animate-slow-spin"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-l from-emerald-500/30 via-blue-500/30 to-cyan-500/30 dark:from-emerald-500/20 dark:via-blue-500/20 dark:to-cyan-500/20 rounded-full blur-3xl animate-slow-spin-reverse"></div>
        <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-transparent dark:from-blue-500/10 dark:via-cyan-500/10 rounded-full blur-3xl animate-slow-spin-reverse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-500/20 via-cyan-500/20 to-transparent dark:from-emerald-500/10 dark:via-cyan-500/10 rounded-full blur-3xl animate-slow-spin delay-75"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"></div>
      </div>
      <div className="relative w-full max-w-4xl mx-auto text-center px-4">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 pb-2">
            Welcome back,
            <br />
            <span className="break-words">{session?.user?.name}</span>.
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full"></div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-8 w-full max-w-2xl mx-auto mt-8 sm:mt-12">
          Which type of timetable are you looking for today?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          <div className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-foreground via-foreground to-foreground/90 text-background hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300">
              <Link href="/class" className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5" />
                <span>Class Timetable</span>
              </Link>
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-foreground/20 text-foreground hover:bg-foreground/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300"
            >
              <Link href="/room" className="flex items-center gap-3">
                <School className="w-5 h-5" />
                <span>Room Timetable</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
