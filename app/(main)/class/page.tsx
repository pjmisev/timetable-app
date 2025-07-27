import { Footer } from "@/components/main/sections/Footer";
import { Hero } from "@/components/main/class/Hero";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Class() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Hero id="top" />
      <Footer />
    </div>
  );
}
