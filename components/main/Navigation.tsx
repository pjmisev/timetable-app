import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  HomeIcon,
  Image,
  LogOut,
  School,
  User,
} from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { ThemeToggle } from "../ui/theme-toggle";

export function Navigation() {
  return (
    <nav className="fixed w-full top-0 z-50 px-4 py-3 fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-4">
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 backdrop-blur-md px-6 py-2 rounded-full border border-foreground/10">
              <NavigationMenuItem className="pe-4">
                <Link
                  href="/home"
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors font-bold"
                >
                  <img
                    className="h-10 p-1 block dark:hidden"
                    src="/img/logo/Timetables_Logo_Black.png"
                  ></img>

                  <img
                    className="h-10 p-1 hidden dark:block"
                    src="/img/logo/Timetables_Logo_White.png"
                  ></img>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className="px-4">
                <Link
                  href="/class"
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" /> <span>Class</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="px-4">
                <Link
                  href="/room"
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <School className="w-4 h-4" /> <span>Room</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="px-4">
                <div
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer"
                  style={{ color: "#ff5757" }}
                >
                  <span
                    onClick={async () => {
                      "use server";
                      await signOut();
                    }}
                    className="flex"
                  >
                    <LogOut className="w-6 h-6 me-2" />
                    Log Out
                  </span>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavigationMenu className="md:hidden flex items-center justify-center bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 backdrop-blur-md px-6 py-2 rounded-full border border-foreground/10">
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem className="">
                <Link
                  href="/home"
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors font-bold"
                >
                  <HomeIcon className="w-6 h-6" />
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavigationMenu className="md:hidden flex items-center justify-center bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 backdrop-blur-md px-6 py-2 rounded-full border border-foreground/10">
            <NavigationMenuList className="flex items-center gap-4">
              <NavigationMenuItem>
                <Link
                  href="/class"
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <GraduationCap className="w-6 h-6" /> <span>Class</span>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/room"
                  className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <School className="w-6 h-6" /> <span>Room</span>
                </Link>
              </NavigationMenuItem>
              <div
                className="text-foreground/80 hover:text-foreground flex items-center gap-2 transition-colors cursor-pointer"
                style={{ color: "#ff5757" }}
              >
                <span
                  onClick={async () => {
                    "use server";
                    await signOut();
                  }}
                  className="flex"
                >
                  <LogOut className="w-6 h-6" />
                </span>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
