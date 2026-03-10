"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { BookOpen, Calendar, CalendarX, CircleAlert, Users } from "lucide-react";

import optionsData from "@/lib/data/classes-options.json";

import { useIsDesktop } from "@/components/timetable/general/useIsDesktop";
import { ResponsivePicker } from "@/components/timetable/general/ResponsivePicker";
import { ToolbarButton } from "@/components/timetable/general/ToolbarButton";
import { SearchableList } from "@/components/timetable/general/SearchableList";
import { EmptyState } from "@/components/timetable/general/EmptyState";
import { ViewToggle, type TimetableViewMode } from "@/components/timetable/general/ViewToggle";
import { WeekView } from "@/components/timetable/general/WeekView";
import { CalendarTimelineView } from "@/components/timetable/general/CalendarTimelineView";

import { DaySection } from "@/components/timetable/class/DaySection";
import { TimetableEntryCard } from "@/components/timetable/class/TimetableEntryCard";
import { groupByDay, computeDayStartEnd, computeGlobalTimeRange } from "@/components/timetable/class/timetableUtils";
import type {
    Option,
    SavedClassResponse,
    TimetableEntry,
    WeekOption,
} from "@/components/timetable/class/types";

import { Badge } from "@/components/ui/badge";

const departments = optionsData.departments as Option[];
const classes = optionsData.classes as Option[];

const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const dayBgClasses: Record<string, string> = {
    Monday: "bg-red-100       dark:bg-red-900/30",
    Tuesday: "bg-yellow-100    dark:bg-yellow-900/30",
    Wednesday: "bg-green-100     dark:bg-emerald-900/30",
    Thursday: "bg-blue-100      dark:bg-blue-900/30",
    Friday: "bg-purple-100    dark:bg-purple-900/30",
    Saturday: "bg-pink-100      dark:bg-pink-900/30",
    Sunday: "bg-gray-100      dark:bg-gray-800/50",
};

function showLoadingSwal() {
    Swal.fire({
        customClass: {
            popup: "my-swal",
            title: "",
            htmlContainer: "",
            confirmButton: "btn-primary",
            cancelButton: "btn-outline",
        },
        buttonsStyling: false,
        background: "var(--popover)",
        color: "var(--popover-foreground)",
        title: "Loading timetable...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });
}

function showErrorSwal() {
    Swal.fire({
        customClass: {
            popup: "my-swal",
            title: "",
            htmlContainer: "",
            confirmButton: "btn-primary",
            cancelButton: "btn-outline",
        },
        buttonsStyling: false,
        background: "var(--popover)",
        color: "var(--popover-foreground)",
        title: "An error has occurred.",
        text: "Please try again later.",
        icon: "error",
        confirmButtonText: "Close",
    });
}

export default function ClassTimetable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDesktop = useIsDesktop();

    const [viewMode, setViewMode] = useState<TimetableViewMode>("calendar");

    // query params
    const qpDepartment = searchParams.get("departmentId");
    const qpClass = searchParams.get("classId");

    // saved prefs
    const [savedDepartment, setSavedDepartment] = useState<string>("");
    const [savedClass, setSavedClass] = useState<string>("");

    useEffect(() => {
        async function fetchSavedClass() {
            try {
                const res = await fetch("/api/timetable/savedClass", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (res.ok) {
                    const data: SavedClassResponse = await res.json();
                    setSavedDepartment(data?.savedDepartment || "");
                    setSavedClass(data?.savedClass || "");
                }
            } catch (error) {
                console.error("Error fetching saved class:", error);
            }
        }

        fetchSavedClass();
    }, []);

    const [selectedDepartment, setSelectedDepartment] = useState<string>(() => {
        const initialDept = qpDepartment || savedDepartment || "";
        return departments.some((d) => d.id === initialDept) ? initialDept : "";
    });

    const [selectedClass, setSelectedClass] = useState<string>(() => {
        const initialClass =
            qpClass || ((!qpDepartment || qpDepartment === savedDepartment) ? savedClass : "") || "";
        return classes.some((c) => c.id === initialClass) ? initialClass : "";
    });

    useEffect(() => {
        const hasQDept = !!qpDepartment;
        const hasQClass = !!qpClass;

        if (!hasQDept && savedDepartment && !selectedDepartment) {
            if (departments.some((d) => d.id === savedDepartment)) setSelectedDepartment(savedDepartment);
        }

        const canUseSavedClass = !hasQDept || (savedDepartment && qpDepartment === savedDepartment);

        if (!hasQClass && savedClass && !selectedClass && canUseSavedClass) {
            if (classes.some((c) => c.id === savedClass)) setSelectedClass(savedClass);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedDepartment, savedClass]);

    const [week, setWeek] = useState(searchParams.get("week") || "");

    // modals
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);

    // searches
    const [deptSearchTerm, setDeptSearchTerm] = useState("");
    const [classSearchTerm, setClassSearchTerm] = useState("");
    const [weekSearchTerm, setWeekSearchTerm] = useState("");

    // timetable
    const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);

    // weeks
    const [weeksList, setWeeksList] = useState<WeekOption[]>([]);
    const [weeksLoading, setWeeksLoading] = useState(true);

    useEffect(() => {
        async function fetchWeeks() {
            try {
                setWeeksLoading(true);
                const res = await fetch("/api/timetable/weekOptions", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (res.ok) setWeeksList(await res.json());
                else setWeeksList([]);
            } catch (error) {
                console.error("Error fetching weeks:", error);
                setWeeksList([]);
            } finally {
                setWeeksLoading(false);
            }
        }

        fetchWeeks();
    }, []);

    // derived lists
    const filteredDepartments = useMemo(() => {
        if (!deptSearchTerm) return departments;
        return departments.filter((d) => d.name.toLowerCase().includes(deptSearchTerm.toLowerCase()));
    }, [deptSearchTerm]);

    const filteredClasses = useMemo(() => {
        const base = selectedDepartment
            ? classes.filter((c) => c.departmentId === selectedDepartment)
            : classes;

        if (!classSearchTerm) return base;
        return base.filter((c) => c.name.toLowerCase().includes(classSearchTerm.toLowerCase()));
    }, [selectedDepartment, classSearchTerm]);

    const filteredWeeks = useMemo(() => {
        if (!weekSearchTerm) return weeksList;
        return weeksList.filter((w) => w.label.toLowerCase().includes(weekSearchTerm.toLowerCase()));
    }, [weekSearchTerm, weeksList]);

    const groupedData = useMemo(() => groupByDay(timetableData), [timetableData]);
    const dayStartEndTimes = useMemo(() => computeDayStartEnd(groupedData), [groupedData]);
    const globalTimeRange = useMemo(() => computeGlobalTimeRange(groupedData), [groupedData]);

    const hasAnyEntries = useMemo(
        () => Object.values(groupedData).some((arr) => Array.isArray(arr) && arr.length > 0),
        [groupedData]
    );

    // URL params
    function updateUrlParams(departmentId: string, classId: string, weekVal: string) {
        const params = new URLSearchParams();
        if (departmentId) params.set("departmentId", departmentId);
        if (classId) params.set("classId", classId);
        if (weekVal) params.set("week", weekVal);
        router.push(`?${params.toString()}`);
    }

    // handlers
    function onSelectDepartment(deptId: string) {
        setSelectedDepartment(deptId);
        setSelectedClass("");
        setIsDeptModalOpen(false);
        updateUrlParams(deptId, "", week);
        setTimeout(() => setDeptSearchTerm(""), 1000);
    }

    function onSelectClass(classId: string) {
        setSelectedClass(classId);
        setIsClassModalOpen(false);
        updateUrlParams(selectedDepartment, classId, week);
        setTimeout(() => setClassSearchTerm(""), 1000);
    }

    function onSelectWeek(weekVal: string) {
        setWeek(weekVal);
        updateUrlParams(selectedDepartment, selectedClass, weekVal);
        setIsWeekModalOpen(false);
        setWeekSearchTerm("");
    }

    // fetch timetable
    useEffect(() => {
        if (!selectedClass) {
            setTimetableData([]);
            return;
        }

        async function fetchTimetable() {
            setLoading(true);
            showLoadingSwal();

            try {
                const params = new URLSearchParams();
                if (selectedDepartment) params.set("departmentId", selectedDepartment);
                params.set("classId", selectedClass);
                if (week) params.set("week", week);

                const res = await fetch(`/api/timetable/class?${params.toString()}`, {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) {
                    setTimetableData([]);
                    return;
                }

                setTimetableData(await res.json());
            } catch (error) {
                console.error("Fetch timetable error:", error);
                setTimetableData([]);
                showErrorSwal();
            } finally {
                setLoading(false);
                Swal.close();
            }
        }

        fetchTimetable();
    }, [selectedClass, week, selectedDepartment]);

    // Display names
    const selectedDepartmentName =
        departments.find((d) => d.id === selectedDepartment)?.name || "Select Department";

    const selectedClassName = classes.find((c) => c.id === selectedClass)?.name || "Select Class";

    const selectedWeekLabel = weeksList.find((w) => w.value === week)?.label || "Select Week";

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Toolbar */}
            <div className="mb-8 rounded-xl border bg-card/60 p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Pickers row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ResponsivePicker
                            isDesktop={isDesktop}
                            open={isDeptModalOpen}
                            onOpenChange={setIsDeptModalOpen}
                            title="Select Department"
                            trigger={
                                <ToolbarButton
                                    icon={<Users className="h-5 w-5" />}
                                    label={selectedDepartmentName}
                                    subLabel="Department"
                                />
                            }
                        >
                            <SearchableList
                                value={deptSearchTerm}
                                onChange={setDeptSearchTerm}
                                placeholder="Search departments..."
                                autoFocus={isDesktop}
                                items={filteredDepartments.map((d) => ({ id: d.id, label: d.name }))}
                                selectedId={selectedDepartment}
                                onSelect={onSelectDepartment}
                                emptyText="No departments found"
                                fullHeightMobile={!isDesktop}
                            />
                        </ResponsivePicker>

                        <ResponsivePicker
                            isDesktop={isDesktop}
                            open={isClassModalOpen}
                            onOpenChange={setIsClassModalOpen}
                            title="Select Class"
                            trigger={
                                <ToolbarButton
                                    icon={<BookOpen className="h-5 w-5" />}
                                    label={selectedClassName}
                                    subLabel="Class"
                                />
                            }
                        >
                            <SearchableList
                                value={classSearchTerm}
                                onChange={setClassSearchTerm}
                                placeholder={selectedDepartment ? "Search classes..." : "Select a department first"}
                                autoFocus={isDesktop}
                                items={filteredClasses.map((c) => ({ id: c.id, label: c.name }))}
                                selectedId={selectedClass}
                                onSelect={onSelectClass}
                                emptyText="No classes found"
                                fullHeightMobile={!isDesktop}
                            />
                        </ResponsivePicker>

                        <ResponsivePicker
                            isDesktop={isDesktop}
                            open={isWeekModalOpen}
                            onOpenChange={setIsWeekModalOpen}
                            title="Select Week"
                            trigger={
                                <ToolbarButton
                                    icon={<Calendar className="h-5 w-5" />}
                                    disabled={weeksLoading}
                                    label={weeksLoading ? "Loading weeks..." : selectedWeekLabel}
                                    subLabel="Week"
                                />
                            }
                        >
                            <SearchableList
                                value={weekSearchTerm}
                                onChange={setWeekSearchTerm}
                                placeholder="Search weeks..."
                                autoFocus={isDesktop}
                                items={filteredWeeks.map((w) => ({ id: w.value, label: w.label }))}
                                selectedId={week}
                                onSelect={onSelectWeek}
                                emptyText={weeksLoading ? "Loading weeks..." : "No weeks found"}
                                fullHeightMobile={!isDesktop}
                            />
                        </ResponsivePicker>
                    </div>

                    {/* View row */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 sm:flex-none">
                                <ViewToggle value={viewMode} onChange={setViewMode} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {!loading && !selectedClass && !hasAnyEntries && (
                <EmptyState
                    icon={<CircleAlert className="h-12 w-12" />}
                    className="fade-in-bottom-12s flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
                >
                    <p>Please select the Department, Class and Week you would like to display from the fields above.</p>
                </EmptyState>
            )}

            {!loading && selectedClass && !hasAnyEntries && (
                <EmptyState
                    icon={<CalendarX className="h-12 w-12" />}
                    className="fade-in-bottom flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
                >
                    <p>No timetable found. It may be unavailable or your parameters are incorrect. please try again.</p>
                </EmptyState>
            )}

            {/* LIST */}
            {hasAnyEntries && viewMode === "list" && (
                <>
                    {daysOrder.map((day) => {
                        const entries = groupedData[day] ?? [];
                        if (!entries.length) return null;

                        const dailyTimes = dayStartEndTimes[day];
                        const timeRange = dailyTimes ? `(${dailyTimes.start} - ${dailyTimes.end})` : "";

                        return (
                            <DaySection
                                key={day}
                                day={day}
                                entries={entries}
                                dayBgClass={dayBgClasses[day] || "bg-muted"}
                                timeRange={timeRange}
                            />
                        );
                    })}
                </>
            )}

            {/* WEEK */}
            {hasAnyEntries && viewMode === "week" && (
                <WeekView
                    daysOrder={daysOrder}
                    entriesByDay={groupedData}
                    dayBgClasses={dayBgClasses}
                    renderEntry={(entry, day, idx) => (
                        <TimetableEntryCard
                            key={`${day}-${idx}`}
                            entry={entry}
                            dayBgClass={dayBgClasses[day] || "bg-muted"}
                        />
                    )}
                />
            )}

            {/* CALENDAR */}
            {hasAnyEntries && viewMode === "calendar" && (
                <CalendarTimelineView
                    daysOrder={daysOrder}
                    entriesByDay={groupedData}
                    dayBgClasses={dayBgClasses}
                    getStart={(e) => e.Start}
                    getEnd={(e) => e.End}
                    resetKey={`${selectedDepartment}-${selectedClass}-${week}`}
                    weekLabel={selectedWeekLabel}
                    scaleMode="fit-content"
                    minHourHeight={56}
                    maxHourHeight={800}
                    startHour={globalTimeRange.startHour}
                    endHour={globalTimeRange.endHour}
                    stepMinutes={60}
                    renderEvent={(e) => (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] text-muted-foreground leading-none whitespace-nowrap">
                                    {e.Start}–{e.End}
                                </div>
                                <Badge className="text-[10px] leading-none whitespace-nowrap" variant="secondary">
                                    {e.Location}
                                </Badge>
                            </div>

                            <div className="mt-1 text-[11px] font-semibold leading-tight break-words">
                                {e.Description}
                            </div>

                            <div className="mt-auto pt-2 text-[10px] text-muted-foreground leading-none">
                                {e.Staff} • {e.Type}
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    );
}
