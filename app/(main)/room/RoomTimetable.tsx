// app/(main)/room/RoomTimetable.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { Building, Calendar, CalendarX, CircleAlert, Cuboid } from "lucide-react";

import optionsData from "@/lib/data/rooms-options.json";

import { useIsDesktop } from "@/components/timetable/general/useIsDesktop";
import { ResponsivePicker } from "@/components/timetable/general/ResponsivePicker";
import { ToolbarButton } from "@/components/timetable/general/ToolbarButton";
import { SearchableList } from "@/components/timetable/general/SearchableList";
import { EmptyState } from "@/components/timetable/general/EmptyState";
import { ViewToggle, type TimetableViewMode } from "@/components/timetable/general/ViewToggle";
import { WeekView } from "@/components/timetable/general/WeekView";
import { CalendarTimelineView } from "@/components/timetable/general/CalendarTimelineView";

import { DaySection } from "@/components/timetable/room/DaySection";
import { RoomEntryCard } from "@/components/timetable/room/RoomEntryCard";
import type { Option, TimetableEntry, WeekOption } from "@/components/timetable/room/types";
import { groupByDay } from "@/components/timetable/room/timetableUtils";
import { normalizeWeekValue } from "@/components/timetable/room/weekUtils";

import { Badge } from "@/components/ui/badge";

const departments = optionsData.departments as Option[];
const rooms = optionsData.rooms as Option[];

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

export default function RoomTimetable() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDesktop = useIsDesktop();

    const [viewMode, setViewMode] = useState<TimetableViewMode>("list");

    const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get("departmentId") || "");
    const [selectedRoom, setSelectedRoom] = useState(searchParams.get("roomId") || "");
    const [week, setWeek] = useState(searchParams.get("week") || "");

    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);

    const [deptSearchTerm, setDeptSearchTerm] = useState("");
    const [roomSearchTerm, setRoomSearchTerm] = useState("");
    const [weekSearchTerm, setWeekSearchTerm] = useState("");

    const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(false);

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

    const filteredDepartments = useMemo(() => {
        if (!deptSearchTerm) return departments;
        return departments.filter((d) => d.name.toLowerCase().includes(deptSearchTerm.toLowerCase()));
    }, [deptSearchTerm]);

    const filteredRooms = useMemo(() => {
        const base = selectedDepartment ? rooms.filter((r) => r.departmentId === selectedDepartment) : rooms;
        if (!roomSearchTerm) return base;
        return base.filter((r) => r.name.toLowerCase().includes(roomSearchTerm.toLowerCase()));
    }, [selectedDepartment, roomSearchTerm]);

    const filteredWeeks = useMemo(() => {
        if (!weekSearchTerm) return weeksList;
        return weeksList.filter((w) => w.label.toLowerCase().includes(weekSearchTerm.toLowerCase()));
    }, [weekSearchTerm, weeksList]);

    const groupedData = useMemo(() => groupByDay(timetableData), [timetableData]);

    const hasAnyEntries = useMemo(
        () => Object.values(groupedData).some((arr) => Array.isArray(arr) && arr.length > 0),
        [groupedData]
    );

    function updateUrlParams(departmentId: string, roomId: string, weekVal: string) {
        const params = new URLSearchParams();
        if (departmentId) params.set("departmentId", departmentId);
        if (roomId) params.set("roomId", roomId);
        if (weekVal) params.set("week", weekVal);
        router.push(`?${params.toString()}`);
    }

    function onSelectDepartment(deptId: string) {
        setSelectedDepartment(deptId);
        setSelectedRoom("");
        setIsDeptModalOpen(false);
        updateUrlParams(deptId, "", week);
        setTimeout(() => setDeptSearchTerm(""), 1000);
    }

    function onSelectRoom(roomId: string) {
        setSelectedRoom(roomId);
        setIsRoomModalOpen(false);
        updateUrlParams(selectedDepartment, roomId, week);
        setTimeout(() => setRoomSearchTerm(""), 1000);
    }

    function onSelectWeek(weekVal: string) {
        const weekToSet = normalizeWeekValue(weekVal);
        setWeek(weekToSet);
        updateUrlParams(selectedDepartment, selectedRoom, weekToSet);
        setIsWeekModalOpen(false);
        setWeekSearchTerm("");
    }

    useEffect(() => {
        if (!selectedRoom) {
            setTimetableData([]);
            return;
        }

        async function fetchTimetable() {
            setLoading(true);
            showLoadingSwal();

            try {
                const params = new URLSearchParams();
                params.set("roomId", selectedRoom);
                if (week) params.set("week", week);

                const res = await fetch(`/api/timetable/room?${params.toString()}`, {
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
    }, [selectedRoom, week]);

    const selectedDepartmentName =
        departments.find((d) => d.id === selectedDepartment)?.name || "Select Department";

    const selectedRoomName = rooms.find((r) => r.id === selectedRoom)?.name || "Select Room";

    const selectedWeekLabel = weeksList.find((w) => w.value === week)?.label || "Select Week";

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Toolbar (matches class timetable) */}
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
                                    icon={<Building className="h-5 w-5" />}
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
                            open={isRoomModalOpen}
                            onOpenChange={setIsRoomModalOpen}
                            title="Select Room"
                            trigger={
                                <ToolbarButton
                                    icon={<Cuboid className="h-5 w-5" />}
                                    label={selectedRoomName}
                                    subLabel="Room"
                                />
                            }
                        >
                            <SearchableList
                                value={roomSearchTerm}
                                onChange={setRoomSearchTerm}
                                placeholder={selectedDepartment ? "Search rooms..." : "Select a department first"}
                                autoFocus={isDesktop}
                                items={filteredRooms.map((r) => ({ id: r.id, label: r.name }))}
                                selectedId={selectedRoom}
                                onSelect={onSelectRoom}
                                emptyText="No rooms found"
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

                    {/* Bottom row: View (same as class) */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 sm:flex-none">
                                <ViewToggle value={viewMode} onChange={setViewMode} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!loading && !selectedRoom && !hasAnyEntries && (
                <EmptyState
                    icon={<CircleAlert className="h-12 w-12" />}
                    className="fade-in-bottom-12s flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
                >
                    <p>Please select the Department, Room and Week you would like to display from the fields above.</p>
                </EmptyState>
            )}

            {!loading && selectedRoom && !hasAnyEntries && (
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

                        return (
                            <DaySection
                                key={day}
                                day={day}
                                entries={entries}
                                dayBgClass={dayBgClasses[day] || "bg-muted"}
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
                        <RoomEntryCard
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
                    resetKey={`${selectedDepartment}-${selectedRoom}-${week}`}
                    scaleMode="fit-content"
                    minHourHeight={56}
                    maxHourHeight={800}
                    startHour={8}
                    endHour={20}
                    stepMinutes={60}
                    renderEvent={(e) => (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] text-muted-foreground leading-none whitespace-nowrap">
                                    {e.Start}–{e.End}
                                </div>
                            </div>

                            <div className="mt-1 text-[11px] font-semibold leading-tight break-words">
                                {e.Description}
                            </div>

                            {!!e.Groups && (
                                <div className="mt-2 flex flex-wrap items-center gap-1">
                                    {e.Groups.split(";")
                                        .map((g) => g.trim())
                                        .filter(Boolean)
                                        .map((g, idx) => (
                                            <Badge
                                                key={`${g}-${idx}`}
                                                className="text-[10px] leading-none whitespace-nowrap"
                                                variant="secondary"
                                            >
                                                {g}
                                            </Badge>
                                        ))}
                                </div>
                            )}

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
