// components/timetable/general/WeekView.tsx
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { usePortraitMobile } from "@/components/timetable/general/usePortraitMobile";

export function WeekView<TEntry>({
                                     daysOrder,
                                     entriesByDay,
                                     dayBgClasses,
                                     renderEntry,
                                     initialDay = "Monday",
                                 }: {
    daysOrder: string[];
    entriesByDay: Record<string, TEntry[]>;
    dayBgClasses: Record<string, string>;
    renderEntry: (entry: TEntry, day: string, index: number) => React.ReactNode;
    initialDay?: string;
}) {
    const isPortraitMobile = usePortraitMobile(640);
    const [activeDay, setActiveDay] = React.useState(initialDay);

    React.useEffect(() => {
        if (!isPortraitMobile) return;

        const has = (d: string) => (entriesByDay[d] ?? []).length > 0;
        if (has(activeDay)) return;

        const firstWithEntries = daysOrder.find(has);
        if (firstWithEntries) setActiveDay(firstWithEntries);
    }, [entriesByDay, daysOrder, isPortraitMobile, activeDay]);

    if (isPortraitMobile) {
        return (
            <div className="fade-in-bottom">
                <Tabs value={activeDay} onValueChange={setActiveDay}>
                    <TabsList className="w-full flex flex-wrap h-auto gap-2 justify-center">
                        {daysOrder.map((day) => {
                            const count = (entriesByDay[day] ?? []).length;
                            const bg = dayBgClasses[day] ?? "bg-muted";
                            return (
                                <TabsTrigger key={day} value={day} className="gap-2">
                                    <span>{day.slice(0, 3)}</span>
                                    <Badge className={`text-black dark:text-white ${bg}`}>{count}</Badge>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {daysOrder.map((day) => (
                        <TabsContent key={day} value={day} className="mt-4">
                            <DayColumn<TEntry>
                                day={day}
                                entries={entriesByDay[day] ?? []}
                                dayBgClass={dayBgClasses[day] ?? "bg-muted"}
                                renderEntry={renderEntry}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        );
    }

    return (
        <div className="fade-in-bottom">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
                {daysOrder.map((day) => (
                    <DayColumn<TEntry>
                        key={day}
                        day={day}
                        entries={entriesByDay[day] ?? []}
                        dayBgClass={dayBgClasses[day] ?? "bg-muted"}
                        renderEntry={renderEntry}
                    />
                ))}
            </div>
        </div>
    );
}

function DayColumn<TEntry>({
                               day,
                               entries,
                               dayBgClass,
                               renderEntry,
                           }: {
    day: string;
    entries: TEntry[];
    dayBgClass: string;
    renderEntry: (entry: TEntry, day: string, index: number) => React.ReactNode;
}) {
    return (
        <div className="rounded-lg border overflow-hidden">
            <div className={`px-3 py-2 font-semibold flex items-center justify-between ${dayBgClass}`}>
                <span>{day}</span>
                <span className="text-sm opacity-80">{entries.length}</span>
            </div>

            <div className="p-3 grid gap-3">
                {entries.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No entries</div>
                ) : (
                    entries.map((entry, idx) => <React.Fragment key={idx}>{renderEntry(entry, day, idx)}</React.Fragment>)
                )}
            </div>
        </div>
    );
}
