"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePortraitMobile } from "@/components/timetable/general/usePortraitMobile";

type TimeRange = { startMin: number; endMin: number };

function timeToMinutes(time: string) {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function formatHourLabel(mins: number) {
    const h = Math.floor(mins / 60);
    const mm = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

type NormalizedEvent<TEntry> = {
    entry: TEntry;
    startMin: number;
    endMin: number;
};

type PlacedEvent<TEntry> = NormalizedEvent<TEntry> & {
    column: number;
    columns: number;
};

type ScaleMode = "off" | "fit-content";

export function CalendarTimelineView<TEntry>({
                                                 daysOrder,
                                                 entriesByDay,
                                                 dayBgClasses,
                                                 getStart,
                                                 getEnd,
                                                 renderEvent,

                                                 initialDay = "Monday",
                                                 weekLabel = "",

                                                 startHour = 8,
                                                 endHour = 18,
                                                 stepMinutes = 60,

                                                 hourHeight = 64,
                                                 gutterWidth = 64,

                                                 scaleMode = "fit-content",
                                                 minHourHeight = 56,
                                                 maxHourHeight = 800,

                                                 resetKey,
                                             }: {
    daysOrder: string[];
    entriesByDay: Record<string, TEntry[]>;
    dayBgClasses: Record<string, string>;

    getStart: (entry: TEntry) => string;
    getEnd: (entry: TEntry) => string;
    renderEvent: (entry: TEntry) => React.ReactNode;

    initialDay?: string;
    weekLabel?: string;

    startHour?: number;
    endHour?: number;
    stepMinutes?: number;
    hourHeight?: number;
    gutterWidth?: number;

    scaleMode?: ScaleMode;
    minHourHeight?: number;
    maxHourHeight?: number;

    resetKey?: string | number;
}) {
    const isPortraitMobile = usePortraitMobile(640);
    
    // Get current day of week for "This Week"
    const getCurrentDayOfWeek = React.useCallback(() => {
        const today = new Date();
        const dayIndex = today.getDay();
        // Convert from JS day index (0=Sunday) to daysOrder index
        const jsIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Sunday becomes 6, Monday becomes 0, etc.
        return jsIndex < daysOrder.length ? daysOrder[jsIndex] : initialDay;
    }, [daysOrder, initialDay]);

    // Determine initial day based on week and device
    const getInitialDay = React.useCallback(() => {
        if (isPortraitMobile && weekLabel?.toLowerCase().includes("this week")) {
            return getCurrentDayOfWeek();
        }
        return initialDay;
    }, [isPortraitMobile, weekLabel, initialDay, getCurrentDayOfWeek]);

    const [activeDay, setActiveDay] = React.useState(getInitialDay());

    const range = React.useMemo<TimeRange>(() => {
        return { startMin: startHour * 60, endMin: endHour * 60 };
    }, [startHour, endHour]);

    const [measuredPxPerMin, setMeasuredPxPerMin] = React.useState<number | null>(null);

    // State for auto-refreshing current time
    const [currentTime, setCurrentTime] = React.useState(new Date());

    // Reset activeDay when week or mobile status changes
    React.useEffect(() => {
        setActiveDay(getInitialDay());
    }, [resetKey, isPortraitMobile, weekLabel, getInitialDay]);

    React.useEffect(() => {
        if (scaleMode === "off") return;
        setMeasuredPxPerMin(null);
    }, [scaleMode, resetKey, activeDay]);

    // Auto-refresh current time every minute
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every 60 seconds (1 minute)

        return () => clearInterval(interval);
    }, []);

    const effectiveHourHeight = React.useMemo(() => {
        if (scaleMode === "off" || !measuredPxPerMin) return hourHeight;

        const computed = measuredPxPerMin * 60;

        return Math.max(minHourHeight, Math.min(maxHourHeight, computed));
    }, [scaleMode, measuredPxPerMin, hourHeight, minHourHeight, maxHourHeight]);

    const totalMinutes = range.endMin - range.startMin;
    const totalHeight = Math.max(1, (totalMinutes / 60) * effectiveHourHeight) + 30; // Add padding to show final time label

    const dayKeys = isPortraitMobile ? [activeDay] : daysOrder;

    const ticks = React.useMemo(() => {
        const t: number[] = [];
        for (let m = range.startMin; m < range.endMin; m += stepMinutes) t.push(m);
        // Always include the end time to ensure the final time label is visible
        if (t.length === 0 || t[t.length - 1] !== range.endMin) {
            t.push(range.endMin);
        }
        return t;
    }, [range.startMin, range.endMin, stepMinutes]);

    const updateMeasured = React.useCallback((pxPerMin: number) => {
        setMeasuredPxPerMin((prev) => {
            const next = prev == null ? pxPerMin : Math.max(prev, pxPerMin);

            if (prev != null && Math.abs(next - prev) < 0.05) return prev;

            return next;
        });
    }, []);

    // Calculate current time for "This Week" display
    const currentTimeMinutes = React.useMemo(() => {
        return currentTime.getHours() * 60 + currentTime.getMinutes();
    }, [currentTime]);

    const getCurrentDayName = React.useCallback(() => {
        const dayIndex = currentTime.getDay();
        const jsIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        return jsIndex < daysOrder.length ? daysOrder[jsIndex] : undefined;
    }, [daysOrder, currentTime]);

    const isThisWeek = weekLabel?.toLowerCase().includes("this week") ?? false;
    const currentDay = getCurrentDayName();
    const showCurrentTimeLine = isThisWeek && currentTimeMinutes >= range.startMin && currentTimeMinutes <= range.endMin;
    const currentTimeLineTop = showCurrentTimeLine ? ((currentTimeMinutes - range.startMin) / 60) * effectiveHourHeight : undefined;

    return (
        <div className="fade-in-bottom">
            {isPortraitMobile ? (
                <Tabs value={activeDay} onValueChange={setActiveDay}>
                    <TabsList className="w-full flex flex-wrap h-auto gap-2 justify-center">
                        {daysOrder.map((day) => (
                            <TabsTrigger key={day} value={day}>
                                {day.slice(0, 3)}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {daysOrder.map((day) => (
                        <TabsContent key={day} value={day} className="mt-4">
                            <SingleDayTimeline<TEntry>
                                day={day}
                                dayBgClass={dayBgClasses[day] ?? "bg-muted"}
                                entries={entriesByDay[day] ?? []}
                                range={range}
                                ticks={ticks}
                                totalHeight={totalHeight}
                                gutterWidth={gutterWidth}
                                hourHeight={effectiveHourHeight}
                                getStart={getStart}
                                getEnd={getEnd}
                                renderEvent={renderEvent}
                                onMeasurePxPerMin={scaleMode === "fit-content" ? updateMeasured : undefined}
                                currentTimeLineTop={showCurrentTimeLine && activeDay === currentDay ? currentTimeLineTop : undefined}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <WeekTimeline<TEntry>
                    dayKeys={dayKeys}
                    dayBgClasses={dayBgClasses}
                    entriesByDay={entriesByDay}
                    range={range}
                    ticks={ticks}
                    totalHeight={totalHeight}
                    gutterWidth={gutterWidth}
                    hourHeight={effectiveHourHeight}
                    getStart={getStart}
                    getEnd={getEnd}
                    renderEvent={renderEvent}
                    onMeasurePxPerMin={scaleMode === "fit-content" ? updateMeasured : undefined}
                    currentTimeLineTop={showCurrentTimeLine ? currentTimeLineTop : undefined}
                />
            )}
        </div>
    );
}

function WeekTimeline<TEntry>({
                                  dayKeys,
                                  dayBgClasses,
                                  entriesByDay,
                                  range,
                                  ticks,
                                  totalHeight,
                                  gutterWidth,
                                  hourHeight,
                                  getStart,
                                  getEnd,
                                  renderEvent,
                                  onMeasurePxPerMin,
                                  currentTimeLineTop,
                              }: {
    dayKeys: string[];
    dayBgClasses: Record<string, string>;
    entriesByDay: Record<string, TEntry[]>;

    range: TimeRange;
    ticks: number[];
    totalHeight: number;

    gutterWidth: number;
    hourHeight: number;

    getStart: (entry: TEntry) => string;
    getEnd: (entry: TEntry) => string;
    renderEvent: (entry: TEntry) => React.ReactNode;

    onMeasurePxPerMin?: (pxPerMin: number) => void;
    currentTimeLineTop?: number;
}) {
    return (
        <div className="rounded-lg border overflow-hidden">
            {/* Header row */}
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `${gutterWidth}px repeat(${dayKeys.length}, minmax(0, 1fr))`,
                }}
            >
                <div className="border-b bg-muted/30" />
                {dayKeys.map((day) => (
                    <div
                        key={day}
                        className={`border-b px-3 py-2 font-semibold ${dayBgClasses[day] ?? "bg-muted"}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="relative overflow-x-auto overflow-y-hidden">
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `${gutterWidth}px repeat(${dayKeys.length}, minmax(0, 1fr))`,
                    }}
                >
                    <TimeGutter range={range} ticks={ticks} totalHeight={totalHeight} hourHeight={hourHeight} />

                    {dayKeys.map((day) => (
                        <DayTimelineColumn<TEntry>
                            key={day}
                            entries={entriesByDay[day] ?? []}
                            range={range}
                            ticks={ticks}
                            totalHeight={totalHeight}
                            hourHeight={hourHeight}
                            getStart={getStart}
                            getEnd={getEnd}
                            renderEvent={renderEvent}
                            onMeasurePxPerMin={onMeasurePxPerMin}
                        />
                    ))}
                </div>

                {/* Lines overlay */}
                <GridLinesOverlay
                    range={range}
                    ticks={ticks}
                    hourHeight={hourHeight}
                    totalHeight={totalHeight}
                />
                
                {/* Current time line */}
                {currentTimeLineTop !== undefined && (
                    <>
                        <svg
                            className="pointer-events-none absolute z-30"
                            style={{
                                top: currentTimeLineTop,
                                left: 0,
                                width: 8,
                                height: 8,
                                transform: 'translateY(calc(-50% + 1px))',
                            }}
                            viewBox="0 0 8 8"
                            preserveAspectRatio="none"
                        >
                            <polygon points="8,4 0,1 0,7" className="fill-red-500 dark:fill-red-700" />
                        </svg>
                        <div
                            className="pointer-events-none absolute left-0 right-0 z-30"
                            style={{ top: currentTimeLineTop, height: 1, paddingLeft: 8, transform: 'translateY(calc(-50% + 1px))' }}
                        >
                            <div className="h-full bg-red-500 dark:bg-red-700" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function SingleDayTimeline<TEntry>({
                                       day,
                                       dayBgClass,
                                       entries,
                                       range,
                                       ticks,
                                       totalHeight,
                                       gutterWidth,
                                       hourHeight,
                                       getStart,
                                       getEnd,
                                       renderEvent,
                                       onMeasurePxPerMin,
                                       currentTimeLineTop,
                                   }: {
    day: string;
    dayBgClass: string;
    entries: TEntry[];

    range: TimeRange;
    ticks: number[];
    totalHeight: number;

    gutterWidth: number;
    hourHeight: number;

    getStart: (entry: TEntry) => string;
    getEnd: (entry: TEntry) => string;
    renderEvent: (entry: TEntry) => React.ReactNode;

    onMeasurePxPerMin?: (pxPerMin: number) => void;
    currentTimeLineTop?: number;
}) {
    return (
        <div className="rounded-lg border overflow-hidden">
            <div className={`px-3 py-2 font-semibold border-b ${dayBgClass}`}>{day}</div>

            <div className="relative">
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `${gutterWidth}px minmax(0, 1fr)`,
                    }}
                >
                    <TimeGutter range={range} ticks={ticks} totalHeight={totalHeight} hourHeight={hourHeight} />

                    <DayTimelineColumn<TEntry>
                        entries={entries}
                        range={range}
                        ticks={ticks}
                        totalHeight={totalHeight}
                        hourHeight={hourHeight}
                        getStart={getStart}
                        getEnd={getEnd}
                        renderEvent={renderEvent}
                        onMeasurePxPerMin={onMeasurePxPerMin}
                    />
                </div>

                <GridLinesOverlay range={range} ticks={ticks} hourHeight={hourHeight} totalHeight={totalHeight} />
                
                {/* Current time line */}
                {currentTimeLineTop !== undefined && (
                    <>
                        <svg
                            className="pointer-events-none absolute z-30"
                            style={{
                                top: currentTimeLineTop,
                                left: 0,
                                width: 8,
                                height: 8,
                                transform: 'translateY(calc(-50% + 1px))',
                            }}
                            viewBox="0 0 8 8"
                            preserveAspectRatio="none"
                        >
                            <polygon points="8,4 0,1 0,7" className="fill-red-500 dark:fill-red-700" />
                        </svg>
                        <div
                            className="pointer-events-none absolute left-0 right-0 z-30"
                            style={{ top: currentTimeLineTop, height: 1, paddingLeft: 8, transform: 'translateY(calc(-50% + 1px))' }}
                        >
                            <div className="h-full bg-red-500 dark:bg-red-700" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function GridLinesOverlay({
                              range,
                              ticks,
                              hourHeight,
                              totalHeight,
                          }: {
    range: TimeRange;
    ticks: number[];
    hourHeight: number;
    totalHeight: number;
}) {
    return (
        <div
            className="pointer-events-none absolute left-0 right-0 z-0"
            style={{ top: 0, height: totalHeight }}
        >
            {ticks.map((t) => {
                const top = ((t - range.startMin) / 60) * hourHeight;
                return (
                    <div key={t} className="absolute left-0 right-0" style={{ top }}>
                        <div className="h-px bg-border/70" />
                    </div>
                );
            })}
        </div>
    );
}

function TimeGutter({
                        range,
                        ticks,
                        totalHeight,
                        hourHeight,
                    }: {
    range: TimeRange;
    ticks: number[];
    totalHeight: number;
    hourHeight: number;
}) {
    return (
        <div className="relative border-r bg-background">
            <div className="relative" style={{ height: totalHeight }}>
                {ticks.map((t) => {
                    const top = ((t - range.startMin) / 60) * hourHeight;
                    return (
                        <div key={t} className="absolute left-0 right-0" style={{ top }}>
                            <div className="px-2 pt-1 text-[11px] leading-none text-muted-foreground">
                                {formatHourLabel(t)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DayTimelineColumn<TEntry>({
                                       entries,
                                       range,
                                       ticks,
                                       totalHeight,
                                       hourHeight,
                                       getStart,
                                       getEnd,
                                       renderEvent,
                                       onMeasurePxPerMin,
                                   }: {
    entries: TEntry[];

    range: TimeRange;
    ticks: number[];
    totalHeight: number;
    hourHeight: number;

    getStart: (entry: TEntry) => string;
    getEnd: (entry: TEntry) => string;
    renderEvent: (entry: TEntry) => React.ReactNode;

    onMeasurePxPerMin?: (pxPerMin: number) => void;
}) {
    const events = React.useMemo(() => {
        const normalized: NormalizedEvent<TEntry>[] = (entries ?? [])
            .map((e) => {
                const s = timeToMinutes(getStart(e));
                const en = timeToMinutes(getEnd(e));
                return { entry: e, startMin: s, endMin: Math.max(en, s + 5) };
            })
            .filter((e) => e.endMin > range.startMin && e.startMin < range.endMin)
            .map((e) => ({
                ...e,
                startMin: clamp(e.startMin, range.startMin, range.endMin),
                endMin: clamp(e.endMin, range.startMin, range.endMin),
            }))
            .sort((a, b) => a.startMin - b.startMin);

        return layoutOverlaps(normalized);
    }, [entries, getStart, getEnd, range.startMin, range.endMin]);

    return (
        <div className="relative bg-background">
            <div className="relative" style={{ height: totalHeight }}>
                {events.map((ev, idx) => {
                    const top = ((ev.startMin - range.startMin) / 60) * hourHeight;
                    const height = ((ev.endMin - ev.startMin) / 60) * hourHeight;

                    const leftPct = (ev.column / ev.columns) * 100;
                    const widthPct = (1 / ev.columns) * 100;

                    const durationMin = Math.max(5, ev.endMin - ev.startMin);

                    const gapX = 10;
                    const gapY = 10;

                    const left = `calc(${leftPct}% + ${gapX / 2}px)`;
                    const width = `calc(${widthPct}% - ${gapX}px)`;

                    return (
                        <div
                            key={idx}
                            className="absolute z-20"
                            style={{
                                top,
                                height,
                                left,
                                width,
                            }}
                        >
                            <div
                                className="absolute left-0 right-0 rounded-md border bg-background/95 shadow-sm overflow-hidden p-2"
                                style={{
                                    top: gapY / 2,
                                    bottom: gapY / 2,
                                }}
                            >
                                <MeasuredContent
                                    minutes={durationMin}
                                    onMeasurePxPerMin={onMeasurePxPerMin}
                                    paddingPx={16 + gapY}
                                >
                                    {renderEvent(ev.entry)}
                                </MeasuredContent>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

function MeasuredContent({
                             minutes,
                             onMeasurePxPerMin,
                             paddingPx = 0,
                             children,
                         }: {
    minutes: number;
    onMeasurePxPerMin?: (pxPerMin: number) => void;
    paddingPx?: number;
    children: React.ReactNode;
}) {
    const ref = React.useRef<HTMLDivElement | null>(null);

    React.useLayoutEffect(() => {
        if (!ref.current || !onMeasurePxPerMin) return;

        const el = ref.current;

        const report = () => {
            const neededPx = el.scrollHeight + paddingPx;

            if (!minutes || minutes <= 0) return;
            const pxPerMin = neededPx / minutes;

            if (Number.isFinite(pxPerMin) && pxPerMin > 0) onMeasurePxPerMin(pxPerMin);
        };

        report();

        const ro = new ResizeObserver(() => report());
        ro.observe(el);

        return () => ro.disconnect();
    }, [minutes, onMeasurePxPerMin, paddingPx]);

    return (
        <div ref={ref} className="w-full">
            {children}
        </div>
    );
}


function layoutOverlaps<TEntry>(events: NormalizedEvent<TEntry>[]): PlacedEvent<TEntry>[] {
    const placed: PlacedEvent<TEntry>[] = [];
    const columnEnd: number[] = [];

    for (const ev of events) {
        let col = 0;
        while (col < columnEnd.length && columnEnd[col] > ev.startMin) col++;
        if (col === columnEnd.length) columnEnd.push(ev.endMin);
        else columnEnd[col] = ev.endMin;

        placed.push({ ...ev, column: col, columns: 1 });
    }

    for (let i = 0; i < placed.length; i++) {
        const a = placed[i];
        let maxCols = 1;

        for (let j = 0; j < placed.length; j++) {
            const b = placed[j];
            const overlaps = a.startMin < b.endMin && b.startMin < a.endMin;
            if (!overlaps) continue;

            const winStart = Math.max(a.startMin, b.startMin);
            const winEnd = Math.min(a.endMin, b.endMin);

            let count = 0;
            for (let k = 0; k < placed.length; k++) {
                const c = placed[k];
                if (c.startMin < winEnd && winStart < c.endMin) count++;
            }
            maxCols = Math.max(maxCols, count);
        }

        a.columns = maxCols;
    }

    return placed;
}
