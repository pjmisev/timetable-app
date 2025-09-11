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
import classes from "./data/classes.json";
import Swal from "sweetalert2";
import {
  Calendar,
  CalendarX,
  CircleAlert,
  Users,
  BookOpen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TimetableEntry {
  Day: string;
  Description: string;
  Type: string;
  Weeks: string;
  Start: string;
  End: string;
  Staff: string;
  Location: string;
}

interface WeekOption {
  value: string;
  label: string;
  weekNumber?: number;
}

export default function ClassTimetable({
  savedDepartment,
  savedClass,
}: {
  savedDepartment?: string;
  savedClass?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qpDepartment = searchParams.get("departmentId");
  const qpClass = searchParams.get("classId");

  const [selectedDepartment, setSelectedDepartment] = useState<string>(() => {
    return qpDepartment || savedDepartment || "";
  });

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (qpClass) return qpClass;
    if (
      !qpDepartment ||
      (savedDepartment && qpDepartment === savedDepartment)
    ) {
      return savedClass || "";
    }
    return "";
  });

  useEffect(() => {
    const hasQDept = !!qpDepartment;
    const hasQClass = !!qpClass;

    if (!hasQDept && savedDepartment && !selectedDepartment) {
      setSelectedDepartment(savedDepartment);
    }

    const canUseSavedClass =
      !hasQDept || (savedDepartment && qpDepartment === savedDepartment);

    if (!hasQClass && savedClass && !selectedClass && canUseSavedClass) {
      setSelectedClass(savedClass);
    }
  }, [savedDepartment, savedClass]);

  const [week, setWeek] = useState(searchParams.get("week") || "");

  // Modals open states
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);

  // Search terms for filtering
  const [deptSearchTerm, setDeptSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
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

  // Filter classes by department and search term
  const filteredClasses = useMemo(() => {
    let filtered = selectedDepartment
      ? classes.filter((c) => c.departmentId === selectedDepartment)
      : classes;

    if (!classSearchTerm) return filtered;

    return filtered.filter((c) =>
      c.name.toLowerCase().includes(classSearchTerm.toLowerCase())
    );
  }, [selectedDepartment, classSearchTerm]);

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
    classId: string,
    weekVal: string
  ) {
    const params = new URLSearchParams();
    if (departmentId) params.set("departmentId", departmentId);
    if (classId) params.set("classId", classId);
    if (weekVal) params.set("week", weekVal);
    router.push(`?${params.toString()}`);
  }

  // Handlers
  function onSelectDepartment(deptId: string) {
    setSelectedDepartment(deptId);
    setSelectedClass("");
    setIsDeptModalOpen(false);
    updateUrlParams(deptId, "", week);
    setTimeout(() => {
      setDeptSearchTerm("");
    }, 1000);
  }

  function onSelectClass(classId: string) {
    setSelectedClass(classId);
    setIsClassModalOpen(false);
    updateUrlParams(selectedDepartment, classId, week);
    setTimeout(() => {
      setClassSearchTerm("");
    }, 1000);
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
    updateUrlParams(selectedDepartment, selectedClass, weekToSet);
    setIsWeekModalOpen(false);
    setWeekSearchTerm("");
  }

  // Fetch timetable when selectedClass or week changes
  useEffect(() => {
    if (!selectedClass) {
      setTimetableData([]);
      return;
    }

    async function fetchTimetable() {
      setLoading(true);
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
        didOpen: () => {
          Swal.showLoading();
        },
      });
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
          setLoading(false);
          Swal.close();
          return;
        }

        const data = await res.json();
        setTimetableData(data);
      } catch (error) {
        setLoading(false);
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
        console.error("Fetch timetable error:", error);
        setTimetableData([]);
      } finally {
        setLoading(false);
        Swal.close();
      }
    }

    fetchTimetable();
  }, [selectedClass, week]);

  // Display names for buttons
  const selectedDepartmentName =
    departments.find((d) => d.id === selectedDepartment)?.name ||
    "Select Department";

  const selectedClassName =
    classes.find((c) => c.id === selectedClass)?.name || "Select Class";

  const selectedWeekLabel =
    weeksList.find(
      (w) =>
        w.value === `week-${week}` ||
        (week === "1" && w.value === "current") ||
        (week === "2" && w.value === "next")
    )?.label || "Select Week";

  const dayBgClasses: Record<string, string> = {
    Monday: "bg-red-100       dark:bg-red-900/30",
    Tuesday: "bg-yellow-100    dark:bg-yellow-900/30",
    Wednesday: "bg-green-100     dark:bg-emerald-900/30",
    Thursday: "bg-blue-100      dark:bg-blue-900/30",
    Friday: "bg-purple-100    dark:bg-purple-900/30",
    Saturday: "bg-pink-100      dark:bg-pink-900/30",
    Sunday: "bg-gray-100      dark:bg-gray-800/50",
  };

  const hasAnyEntries = useMemo(
    () =>
      Object.values(groupedData).some(
        (arr) => Array.isArray(arr) && arr.length > 0
      ),
    [groupedData]
  );

  function useIsDesktop(breakpoint = 640) {
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
      const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
        setIsDesktop(
          "matches" in e ? e.matches : (e as MediaQueryList).matches
        );

      // set initial
      setIsDesktop(mql.matches);

      // subscribe (support older Safari)
      if (mql.addEventListener) mql.addEventListener("change", onChange as any);
      else mql.addListener(onChange as any);

      return () => {
        if (mql.removeEventListener)
          mql.removeEventListener("change", onChange as any);
        else mql.removeListener(onChange as any);
      };
    }, [breakpoint]);

    return isDesktop;
  }

  const isDesktop = useIsDesktop();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-[max-content_max-content_max-content] gap-4 mb-8 items-end justify-center">
        {/* Department Modal */}
        {isDesktop ? (
          <Dialog open={isDeptModalOpen} onOpenChange={setIsDeptModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="font-bold fade-in-bottom-05s whitespace-normal h-auto min-h-10 py-2 px-3 text-wrap"
              >
                <Users className="shrink-0" />
                <span className="text-left">{selectedDepartmentName}</span>
              </Button>
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
        ) : (
          <Sheet open={isDeptModalOpen} onOpenChange={setIsDeptModalOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="font-bold fade-in-bottom-05s whitespace-normal h-auto min-h-10 py-2 px-3 text-wrap"
              >
                <Users className="shrink-0" />
                <span className="text-left">{selectedDepartmentName}</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[85vh] w-full p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
                  <SheetTitle>Select Department</SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2">
                  <Input
                    placeholder="Search departments..."
                    value={deptSearchTerm}
                    onChange={(e) => setDeptSearchTerm(e.target.value)}
                    className="mb-4 shrink-0"
                  />

                  <ul className="flex-1 min-h-0 overflow-auto border rounded-md border-gray-200">
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
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Class Modal */}
        {isDesktop ? (
          <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
            <DialogTrigger asChild className="fade-in-bottom-07s">
              <Button
                variant="outline"
                className="font-bold fade-in-bottom-07s whitespace-normal h-auto min-h-10 py-2 px-3 text-wrap"
              >
                <BookOpen className="shrink-0" />
                <span className="text-left">{selectedClassName}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[500px] overflow-auto">
              <DialogHeader>
                <DialogTitle>Select Class</DialogTitle>
              </DialogHeader>

              <Input
                placeholder={
                  selectedDepartment
                    ? "Search classes..."
                    : "Select a department first"
                }
                value={classSearchTerm}
                onChange={(e) => setClassSearchTerm(e.target.value)}
                autoFocus
                className="mb-4"
              />

              <ul className="max-h-72 overflow-auto border rounded-md border-gray-200">
                {filteredClasses.length === 0 && (
                  <li className="px-3 py-2 text-muted-foreground">
                    No classes found
                  </li>
                )}
                {filteredClasses.map((cls) => (
                  <li
                    key={cls.id}
                    onClick={() => onSelectClass(cls.id)}
                    className={`cursor-pointer px-3 py-2 border-b last:border-b-0 hover:bg-primary hover:text-white ${
                      cls.id === selectedClass ? "font-bold" : ""
                    }`}
                  >
                    {cls.name}
                  </li>
                ))}
              </ul>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsClassModalOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Sheet open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="font-bold fade-in-bottom-07s whitespace-normal h-auto min-h-10 py-2 px-3 text-wrap"
              >
                <BookOpen className="shrink-0" />
                <span className="text-left">{selectedClassName}</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[85vh] w-full p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
                  <SheetTitle>Select Class</SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2">
                  <Input
                    placeholder={
                      selectedDepartment
                        ? "Search classes..."
                        : "Select a department first"
                    }
                    value={classSearchTerm}
                    onChange={(e) => setClassSearchTerm(e.target.value)}
                    className="mb-4 shrink-0"
                  />

                  <ul className="flex-1 min-h-0 overflow-auto border rounded-md border-gray-200">
                    {filteredClasses.length === 0 && (
                      <li className="px-3 py-2 text-muted-foreground">
                        No classes found
                      </li>
                    )}
                    {filteredClasses.map((cls) => (
                      <li
                        key={cls.id}
                        onClick={() => onSelectClass(cls.id)}
                        className={`cursor-pointer px-3 py-2 border-b last:border-b-0 hover:bg-primary hover:text-white ${
                          cls.id === selectedClass ? "font-bold" : ""
                        }`}
                      >
                        {cls.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {isDesktop ? (
          <Dialog open={isWeekModalOpen} onOpenChange={setIsWeekModalOpen}>
            <DialogTrigger asChild className="fade-in-bottom-10s">
              <Button
                variant="outline"
                className="font-bold fade-in-bottom-10s whitespace-normal h-auto min-h-10 py-2 px-3 text-wrap"
              >
                <Calendar className="shrink-0" />
                <span className="text-left">{selectedWeekLabel}</span>
              </Button>
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
        ) : (
          <Sheet open={isWeekModalOpen} onOpenChange={setIsWeekModalOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="font-bold fade-in-bottom-10s whitespace-normal h-auto min-h-10 py-2 px-3 text-wrap"
              >
                <Calendar className="shrink-0" />
                <span className="text-left">{selectedWeekLabel}</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-[85vh] w-full p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
                  <SheetTitle>Select Week</SheetTitle>
                </SheetHeader>

                <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2">
                  <Input
                    placeholder="Search weeks..."
                    value={weekSearchTerm}
                    onChange={(e) => setWeekSearchTerm(e.target.value)}
                    className="mb-4 shrink-0"
                  />

                  <ul className="flex-1 min-h-0 overflow-auto border rounded-md border-gray-200">
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
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Empty state (only when not loading, a class is selected, and no entries) */}
      {!loading && !selectedClass && !hasAnyEntries && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground fade-in-bottom-12s">
          <CircleAlert className="h-12 w-12 mb-4" />
          <p>
            Please select the Department, Class and Week you would like to
            display from the fields above.
          </p>
        </div>
      )}

      {/* Empty state (only when not loading, a class is selected, and no entries) */}
      {!loading && selectedClass && !hasAnyEntries && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground fade-in-bottom">
          <CalendarX className="h-12 w-12 mb-4" />
          <p>
            No timetable found. It may be unavailable or your parameters are
            incorrect. please try again.
          </p>
        </div>
      )}

      {/* Timetable display (only when entries exist) */}
      {hasAnyEntries && (
        <>
          {daysOrder.map((day) => {
            const entries = groupedData[day];
            if (!entries || entries.length === 0) return null;

            return (
              <div key={day} className="mb-6 fade-in-bottom">
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
                            className={`text-black dark:text-white ${
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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Location:</span>
                          <Badge
                            className={`text-black dark:text-white ${
                              dayBgClasses[day] || "bg-muted"
                            }`}
                          >
                            {entry.Location}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
