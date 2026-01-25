"use client";

import React from "react";
import type { TimetableEntry } from "./types";
import { TimetableEntryCard } from "./TimetableEntryCard";

export function DaySection({
                               day,
                               entries,
                               dayBgClass,
                               timeRange,
                           }: {
    day: string;
    entries: TimetableEntry[];
    dayBgClass: string;
    timeRange: string;
}) {
    return (
        <div className="mb-6 fade-in-bottom">
            <h2
                className={`text-xl font-semibold mb-3 px-3 py-2 rounded-md flex items-center justify-between ${
                    dayBgClass || "bg-muted"
                }`}
            >
                <div className="flex items-center space-x-2">
                    <span>{day}</span>
                </div>

                <span className="text-sm font-normal text-inherit dark:text-inherit opacity-80">
          {timeRange.trim()}
        </span>
            </h2>

            <div className="grid gap-4">
                {entries.map((entry, i) => (
                    <TimetableEntryCard
                        key={`${day}-${i}`}
                        entry={entry}
                        dayBgClass={dayBgClass || "bg-muted"}
                    />
                ))}
            </div>
        </div>
    );
}
