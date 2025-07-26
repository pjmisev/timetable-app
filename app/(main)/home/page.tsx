import { FAQ } from "@/components/main/sections/faq/Faq";
import { Footer } from "@/components/main/sections/Footer";
import { Hero } from "@/components/main/sections/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Hero id="top" />
      <FAQ id="faq" />
      <Footer />
    </div>
  );
}
