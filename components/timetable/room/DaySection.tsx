"use client";

import React from "react";
import type { TimetableEntry } from "./types";
import { RoomEntryCard } from "./RoomEntryCard";

export function DaySection({
                               day,
                               entries,
                               dayBgClass,
                           }: {
    day: string;
    entries: TimetableEntry[];
    dayBgClass: string;
}) {
    return (
        <div className="mb-6 fade-in-bottom">
            <h2 className={`text-xl font-semibold mb-3 px-3 py-2 rounded-md ${dayBgClass || "bg-muted"}`}>
                {day}
            </h2>

            <div className="grid gap-4">
                {entries.map((entry, i) => (
                    <RoomEntryCard key={`${day}-${i}`} entry={entry} dayBgClass={dayBgClass || "bg-muted"} />
                ))}
            </div>
        </div>
    );
}
