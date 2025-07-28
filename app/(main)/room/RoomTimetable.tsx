"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

export default function RoomTimetable({
  initialData,
}: {
  initialData: TimetableEntry[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [roomId, setRoomId] = useState(searchParams.get("roomId") || "");
  const [week, setWeek] = useState(searchParams.get("week") || "");

  const groupedData = initialData.reduce(
    (acc: Record<string, TimetableEntry[]>, entry) => {
      if (!acc[entry.Day]) acc[entry.Day] = [];
      acc[entry.Day].push(entry);
      return acc;
    },
    {}
  );

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (roomId) params.set("roomId", roomId);
    if (week) params.set("week", week);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div>
          <Label htmlFor="roomId">Room ID</Label>
          <Input
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="week">Week</Label>
          <Input
            id="week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button className="w-full" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {daysOrder.map((day) => {
        const entries = groupedData[day];
        if (!entries) return null;

        return (
          <div key={day} className="mb-6">
            <h2 className="text-xl font-semibold mb-3 bg-muted px-3 py-2 rounded-md">
              {day}
            </h2>
            <div className="grid gap-4">
              {entries.map((entry, i) => (
                <Card key={i}>
                  <CardHeader className="relative pb-2">
                    <CardTitle className="text-base sm:text-lg">
                      {entry.Description}
                    </CardTitle>
                    <div className="absolute top-3 right-4 text-sm sm:text-base font-medium">
                      {entry.Start} - {entry.End}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entry.Type}
                    </p>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p>Weeks: {entry.Weeks}</p>
                    <p>Group: {entry.Groups}</p>
                    <p className="text-muted-foreground">{entry.Staff}</p>
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
