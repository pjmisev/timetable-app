import { FAQ } from "@/components/welcome/sections/faq/Faq";
import { Footer } from "@/components/welcome/sections/Footer";
import { Hero } from "@/components/welcome/sections/Hero";

export default async function Welcome() {
  return (
    <div className="min-h-screen">
      <Hero id="top" />
      <FAQ />
      <Footer />
    </div>
  );
}
