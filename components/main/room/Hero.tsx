import type { AnimatedProps } from "@/types/motion";

export async function Hero({ id }: AnimatedProps) {
  return (
    <section
      id={id}
      className="relative flex items-start pt-20 justify-center px-4 sm:px-6 overflow-hidden"
    >
      <div className="relative w-full max-w-4xl mx-auto text-center px-4 pt-20 sm:pt-24">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 pb-2 fade-in-bottom">
            Room Timetable
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full fade-in-bottom"></div>
        </div>
      </div>
    </section>
  );
}
