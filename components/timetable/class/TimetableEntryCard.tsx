"use client";

import React from "react";
import type { TimetableEntry } from "./types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TimetableEntryCard({
                                       entry,
                                       dayBgClass,
                                   }: {
    entry: TimetableEntry;
    dayBgClass: string;
}) {
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
                    <span className="font-medium">Location:</span>
                    <Badge className={`text-black dark:text-white ${dayBgClass}`}>
                        {entry.Location}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
