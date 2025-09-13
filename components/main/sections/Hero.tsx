import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import type { AnimatedProps } from "@/types/motion";
import { GraduationCap, School } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";

export async function Hero({ id }: AnimatedProps) {
  const session = await auth();

  console.log(session);

  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      <div className="relative w-full max-w-4xl mx-auto text-center px-4">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 pb-2 fade-in-bottom">
            Welcome back,
            <br />
            <span className="break-words">{session?.user?.name}</span>.
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full fade-in-bottom"></div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-8 w-full max-w-2xl mx-auto mt-8 sm:mt-12 fade-in-bottom-05s">
          Which type of timetable are you looking for today?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative fade-in-bottom-10s">
          <div className="w-full sm:w-auto">
            <Link href="/class">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-foreground via-foreground to-foreground/90 text-background hover:opacity-90 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5" />
                  <span>Class Timetable</span>
                </div>
              </Button>
            </Link>
          </div>
          <div className="w-full sm:w-auto">
            <Link href="/room">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-foreground/20 text-foreground hover:bg-foreground/10 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <School className="w-5 h-5" />
                  <span>Room Timetable</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
