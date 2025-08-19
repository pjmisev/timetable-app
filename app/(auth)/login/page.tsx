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

      <div className="relative w-full max-w-sm flex flex-col items-center justify-center gap-6 z-10">
        <div className="flex items-center gap-2 self-center font-medium">
          <Link href="/" className="text-lg font-semibold fade-in-bottom">
            Timetable App by PJmisev
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
