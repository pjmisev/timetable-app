import { Footer } from "@/components/main/sections/Footer";
import { Hero } from "@/components/main/sections/Hero";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Hero id="top" />
      <Footer />
    </div>
  );
}
