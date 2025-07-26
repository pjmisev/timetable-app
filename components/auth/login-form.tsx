"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Login with your Google, Microsoft or GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google")}
              >
                <Image
                  height={15}
                  width={15}
                  src="/img/auth/google.svg"
                  alt="Google Login Logo"
                />
                Login with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("microsoft-entra-id")}
              >
                <Image
                  height={15}
                  width={15}
                  src="/img/auth/microsoft.svg"
                  alt="Microsoft Login Logo"
                />
                Login with Microsoft
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("github")}
              >
                <Image
                  height={15}
                  width={15}
                  src="/img/auth/github.svg"
                  alt="GitHub Login Logo"
                />{" "}
                Login with GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to this app storing your name, email and
        profile picture.
      </div>
    </div>
  );
}
