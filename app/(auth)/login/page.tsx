import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import * as motion from "motion/react-client";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/home");
  }

  return (
    <div className="relative min-h-svh flex items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Background gradients - same as the Hero component */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-emerald-500/30 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-emerald-500/20 rounded-full blur-3xl animate-slow-spin"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-l from-emerald-500/30 via-blue-500/30 to-cyan-500/30 dark:from-emerald-500/20 dark:via-blue-500/20 dark:to-cyan-500/20 rounded-full blur-3xl animate-slow-spin-reverse"></div>
        <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-transparent dark:from-blue-500/10 dark:via-cyan-500/10 rounded-full blur-3xl animate-slow-spin-reverse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-500/20 via-cyan-500/20 to-transparent dark:from-emerald-500/10 dark:via-cyan-500/10 rounded-full blur-3xl animate-slow-spin delay-75"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay"></div>
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center justify-center gap-6 z-10">
        <div className="flex items-center gap-2 self-center font-medium">
          <Link href="/" className="text-lg font-semibold">
            Timetable App by PJmisev
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
