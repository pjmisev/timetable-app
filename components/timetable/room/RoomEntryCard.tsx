"use client";

import React from "react";
import type { TimetableEntry } from "./types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function splitGroups(groups: string) {
    return (groups || "")
        .split(";")
        .map((g) => g.trim())
        .filter(Boolean);
}

export function RoomEntryCard({
                                  entry,
                                  dayBgClass,
                              }: {
    entry: TimetableEntry;
    dayBgClass: string;
}) {
    const groups = splitGroups(entry.Groups);

    return (
        <Card>
            <CardHeader className="relative">
        <CardTitle className="text-base sm:text-lg">
        <Badge className={`text-black dark:text-white ${dayBgClass}`}>
    {entry.Start} - {entry.End}
    </Badge>
    <p className="pt-2">{entry.Description}</p>
        </CardTitle>

        <p className="text-sm text-muted-foreground">
    <span className="font-bold">{entry.Staff}</span> - {entry.Type}
        </p>
        </CardHeader>

        <CardContent className="text-sm">
    <div className="flex flex-wrap items-center gap-2">
    <span className="font-medium">Groups:</span>
    {groups.map((g, idx) => (
        <Badge key={`${idx}-${g}`} className={`text-black dark:text-white ${dayBgClass}`}>
        {g}
        </Badge>
    ))}
    </div>
    </CardContent>
    </Card>
);
}
