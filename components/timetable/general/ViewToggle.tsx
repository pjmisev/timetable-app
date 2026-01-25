"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutList, CalendarDays, Grid3X3 } from "lucide-react";

export type TimetableViewMode = "list" | "week" | "calendar";

const modes: {
    value: TimetableViewMode;
    label: string;
    icon: React.ReactNode;
}[] = [
    { value: "list", label: "List", icon: <LayoutList className="h-4 w-4" /> },
    { value: "week", label: "Week", icon: <Grid3X3 className="h-4 w-4" /> },
    { value: "calendar", label: "Calendar", icon: <CalendarDays className="h-4 w-4" /> },
];

export function ViewToggle({
                               value,
                               onChange,
                               className,
                           }: {
    value: TimetableViewMode;
    onChange: (mode: TimetableViewMode) => void;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "grid grid-cols-3 rounded-xl border bg-background p-1 shadow-sm w-full sm:w-[340px]",
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
                        className={cn(
                            "h-10 rounded-lg gap-2 px-2",
                            !active && "text-muted-foreground"
                        )}
                    >
                        {m.icon}
                        <span className="text-sm font-medium">{m.label}</span>
                    </Button>
                );
            })}
        </div>
    );
}
