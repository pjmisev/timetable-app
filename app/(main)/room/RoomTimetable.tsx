"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import departments from "./data/departments.json";
import rooms from "./data/rooms.json";

interface TimetableEntry {
  Day: string;
  Description: string;
  Type: string;
  Weeks: string;
  Groups: string;
  Start: string;
  End: string;
  Staff: string;
}

interface WeekOption {
  value: string;
  label: string;
  weekNumber?: number;
}

export default function RoomTimetable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for selection
  const [selectedDepartment, setSelectedDepartment] = useState(
    searchParams.get("departmentId") || ""
  );
  const [selectedRoom, setSelectedRoom] = useState(
    searchParams.get("roomId") || ""
  );
  const [week, setWeek] = useState(searchParams.get("week") || "");

  // Modals open states
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);

  // Search terms for filtering
  const [deptSearchTerm, setDeptSearchTerm] = useState("");
  const [roomSearchTerm, setRoomSearchTerm] = useState("");
  const [weekSearchTerm, setWeekSearchTerm] = useState("");

  // Timetable data + loading state
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter departments by search term
  const filteredDepartments = useMemo(() => {
    if (!deptSearchTerm) return departments;
    return departments.filter((d) =>
      d.name.toLowerCase().includes(deptSearchTerm.toLowerCase())
    );
  }, [deptSearchTerm]);

  // Filter rooms by department and search term
  const filteredRooms = useMemo(() => {
    let filtered = selectedDepartment
      ? rooms.filter((r) => r.departmentId === selectedDepartment)
      : rooms;

    if (!roomSearchTerm) return filtered;

    return filtered.filter((r) =>
      r.name.toLowerCase().includes(roomSearchTerm.toLowerCase())
    );
  }, [selectedDepartment, roomSearchTerm]);

  // Generate weeks list
  const weeksList = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setHours(0, 0, 0, 0);
    mondayThisWeek.setDate(today.getDate() + diffToMonday);

    const weeks: WeekOption[] = [];
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    // Special options
    const specialOptions: WeekOption[] = [
      { value: "current", label: "This Week", weekNumber: 1 },
      { value: "next", label: "Next Week", weekNumber: 2 },
    ];

    // Regular weeks
    for (let i = 1; i <= 52; i++) {
      const monday = new Date(mondayThisWeek);
      monday.setDate(mondayThisWeek.getDate() + (i - 1) * 7);

      const labelDate = monday.toLocaleDateString("en-GB", options);
      weeks.push({
        value: `week-${i}`,
        label: `w/c ${labelDate} (Wk ${i})`,
        weekNumber: i,
      });
    }

    return [...specialOptions, ...weeks];
  }, []);

  // Filter weeks by search
  const filteredWeeks = useMemo(() => {
    if (!weekSearchTerm) return weeksList;
    return weeksList.filter((w) =>
      w.label.toLowerCase().includes(weekSearchTerm.toLowerCase())
    );
  }, [weekSearchTerm, weeksList]);

  // Group timetable data by day
  const groupedData = useMemo(() => {
    const result: Record<string, TimetableEntry[]> = {};

    if (
      !timetableData ||
      !Array.isArray(timetableData) ||
      timetableData.length === 0
    ) {
      return result;
    }

    for (const entry of timetableData) {
      if (entry?.Day) {
        if (!result[entry.Day]) {
          result[entry.Day] = [];
        }
        result[entry.Day].push(entry);
      }
    }

    return result;
  }, [timetableData]);

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Update URL params in the browser
  function updateUrlParams(
    departmentId: string,
    roomId: string,
    weekVal: string
  ) {
    const params = new URLSearchParams();
    if (departmentId) params.set("departmentId", departmentId);
    if (roomId) params.set("roomId", roomId);
    if (weekVal) params.set("week", weekVal);
    router.push(`?${params.toString()}`);
  }

  // Handlers
  function onSelectDepartment(deptId: string) {
    setSelectedDepartment(deptId);
    setSelectedRoom("");
    setIsDeptModalOpen(false);
    setDeptSearchTerm("");
    updateUrlParams(deptId, "", week);
  }

  function onSelectRoom(roomId: string) {
    setSelectedRoom(roomId);
    setIsRoomModalOpen(false);
    setRoomSearchTerm("");
    updateUrlParams(selectedDepartment, roomId, week);
  }

  function onSelectWeek(weekVal: string) {
    let weekToSet = weekVal;

    if (weekVal === "current") {
      weekToSet = "1";
    } else if (weekVal === "next") {
      weekToSet = "2";
    } else if (weekVal.startsWith("week-")) {
      weekToSet = weekVal.replace("week-", "");
    }

    setWeek(weekToSet);
    updateUrlParams(selectedDepartment, selectedRoom, weekToSet);
    setIsWeekModalOpen(false);
    setWeekSearchTerm("");
  }

  // Fetch timetable when selectedRoom or week changes
  useEffect(() => {
    if (!selectedRoom) {
      setTimetableData([]);
      return;
    }

    async function fetchTimetable() {
      setLoading(true);
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
          setLoading(false);
          return;
        }

        const data = await res.json();
        setTimetableData(data);
      } catch (error) {
        console.error("Fetch timetable error:", error);
        setTimetableData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTimetable();
  }, [selectedRoom, week]);

  // Display names for buttons
  const selectedDepartmentName =
    departments.find((d) => d.id === selectedDepartment)?.name ||
    "Select Department";

  const selectedRoomName =
    rooms.find((r) => r.id === selectedRoom)?.name || "Select Room";

  const selectedWeekLabel =
    weeksList.find(
      (w) =>
        w.value === `week-${week}` ||
        (week === "1" && w.value === "current") ||
        (week === "2" && w.value === "next")
    )?.label || "Select Week";

  const dayBgClasses: Record<string, string> = {
    Monday: "bg-red-100",
    Tuesday: "bg-yellow-100",
    Wednesday: "bg-green-100",
    Thursday: "bg-blue-100",
    Friday: "bg-purple-100",
    Saturday: "bg-pink-100",
    Sunday: "bg-gray-100",
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-[max-content_max-content_max-content] gap-4 mb-8 items-end">
        {/* Department Modal */}
        <Dialog open={isDeptModalOpen} onOpenChange={setIsDeptModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{selectedDepartmentName}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[500px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Select Department</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Search departments..."
              value={deptSearchTerm}
              onChange={(e) => setDeptSearchTerm(e.target.value)}
              autoFocus
              className="mb-4"
            />

            <ul className="max-h-72 overflow-auto border rounded-md border-gray-200">
              {filteredDepartments.length === 0 && (
                <li className="px-3 py-2 text-muted-foreground">
                  No departments found
                </li>
              )}
              {filteredDepartments.map((dept) => (
                <li
                  key={dept.id}
                  onClick={() => onSelectDepartment(dept.id)}
                  className={`cursor-pointer px-3 py-2 border-b last:border-b-0 hover:bg-primary hover:text-white ${
                    dept.id === selectedDepartment ? "font-bold" : ""
                  }`}
                >
                  {dept.name}
                </li>
              ))}
            </ul>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeptModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Room Modal */}
        <Dialog open={isRoomModalOpen} onOpenChange={setIsRoomModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{selectedRoomName}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[500px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Select Room</DialogTitle>
            </DialogHeader>

            <Input
              placeholder={
                selectedDepartment
                  ? "Search rooms..."
                  : "Select a department first"
              }
              value={roomSearchTerm}
              onChange={(e) => setRoomSearchTerm(e.target.value)}
              autoFocus
              className="mb-4"
            />

            <ul className="max-h-72 overflow-auto border rounded-md border-gray-200">
              {filteredRooms.length === 0 && (
                <li className="px-3 py-2 text-muted-foreground">
                  No rooms found
                </li>
              )}
              {filteredRooms.map((room) => (
                <li
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`cursor-pointer px-3 py-2 border-b last:border-b-0 hover:bg-primary hover:text-white ${
                    room.id === selectedRoom ? "font-bold" : ""
                  }`}
                >
                  {room.name}
                </li>
              ))}
            </ul>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoomModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Week Modal */}
        <Dialog open={isWeekModalOpen} onOpenChange={setIsWeekModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">{selectedWeekLabel}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[500px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Select Week</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Search weeks..."
              value={weekSearchTerm}
              onChange={(e) => setWeekSearchTerm(e.target.value)}
              autoFocus
              className="mb-4"
            />

            <ul className="max-h-72 overflow-auto border rounded-md border-gray-200">
              {filteredWeeks.length === 0 && (
                <li className="px-3 py-2 text-muted-foreground">
                  No weeks found
                </li>
              )}
              {filteredWeeks.map((w) => (
                <li
                  key={w.value}
                  onClick={() => onSelectWeek(w.value)}
                  className={`cursor-pointer px-3 py-2 border-b last:border-b-0 hover:bg-primary hover:text-white ${
                    w.value === `week-${week}` ||
                    (week === "1" && w.value === "current") ||
                    (week === "2" && w.value === "next")
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {w.label}
                </li>
              ))}
            </ul>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsWeekModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable display */}
      {loading && <p>Loading timetable...</p>}

      {daysOrder.map((day) => {
        const entries = groupedData[day];
        if (!entries || entries.length === 0) return null;

        return (
          <div key={day} className="mb-6">
            <h2
              className={`text-xl font-semibold mb-3 px-3 py-2 rounded-md ${
                dayBgClasses[day] || "bg-muted"
              }`}
            >
              {day}
            </h2>
            <div className="grid gap-4">
              {entries.map((entry, i) => (
                <Card key={`${day}-${i}`}>
                  <CardHeader className="relative">
                    <CardTitle className="text-base sm:text-lg">
                      <Badge
                        className={`text-black ${
                          dayBgClasses[day] || "bg-muted"
                        }`}
                      >
                        {entry.Start} - {entry.End}
                      </Badge>
                      <p className="pt-2">{entry.Description}</p>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold">{entry.Staff}</span> -{" "}
                      {entry.Type}
                    </p>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Group: {entry.Groups}</p>
                    <p className="text-muted-foreground"></p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
