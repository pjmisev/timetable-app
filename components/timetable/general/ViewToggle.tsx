"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutList, CalendarDays, Grid3X3 } from "lucide-react";

export type TimetableViewMode = "list" | "week" | "calendar";

const allModes: {
    value: TimetableViewMode;
    label: string;
    icon: React.ReactNode;
}[] = [
    { value: "calendar", label: "Calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { value: "list", label: "List", icon: <LayoutList className="h-4 w-4" /> },
    { value: "week", label: "Week", icon: <Grid3X3 className="h-4 w-4" /> },
];

function useIsSmUp() {
    const [isSmUp, setIsSmUp] = React.useState(true);

    React.useEffect(() => {
        const mql = window.matchMedia("(min-width: 640px)");
        const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
            setIsSmUp("matches" in e ? e.matches : (e as MediaQueryList).matches);

        setIsSmUp(mql.matches);

        if (mql.addEventListener) mql.addEventListener("change", onChange as any);
        else mql.addListener(onChange as any);

        return () => {
            if (mql.removeEventListener) mql.removeEventListener("change", onChange as any);
            else mql.removeListener(onChange as any);
        };
    }, []);

    return isSmUp;
}

export function ViewToggle({
                               value,
                               onChange,
                               className,
                           }: {
    value: TimetableViewMode;
    onChange: (mode: TimetableViewMode) => void;
    className?: string;
}) {
    const isSmUp = useIsSmUp();

    // Hide week on mobile
    const modes = React.useMemo(
        () => (isSmUp ? allModes : allModes.filter((m) => m.value !== "week")),
        [isSmUp]
    );

    // If user is on mobile but currently in week view, auto-fallback
    React.useEffect(() => {
        if (!isSmUp && value === "week") onChange("list");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSmUp]);

    return (
        <div
            className={cn(
                "grid rounded-xl border bg-background p-1 shadow-sm w-full sm:w-[340px]",
                isSmUp ? "grid-cols-3" : "grid-cols-2",
                className
            )}
        >
            {modes.map((m) => {
                const active = value === m.value;

                return (
                    <Button
                        key={m.value}
                        type="button"
                        onClick={() => onChange(m.value)}
                        variant={active ? "default" : "ghost"}
                        className={cn("h-10 rounded-lg gap-2 px-2", !active && "text-muted-foreground")}
                    >
                        {m.icon}
                        <span className="text-sm font-medium">{m.label}</span>
                    </Button>
                );
            })}
        </div>
    );
}
