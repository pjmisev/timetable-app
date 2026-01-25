import type { TimetableEntry } from "./types";

export function groupByDay(data: TimetableEntry[]) {
    const result: Record<string, TimetableEntry[]> = {};
    if (!Array.isArray(data) || data.length === 0) return result;

    for (const entry of data) {
        if (!entry?.Day) continue;
        if (!result[entry.Day]) result[entry.Day] = [];
        result[entry.Day].push(entry);
    }

    return result;
}
