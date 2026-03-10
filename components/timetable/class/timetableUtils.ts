import type { TimetableEntry } from "./types";

export function timeToMinutes(time: string): number {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

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

export function computeDayStartEnd(grouped: Record<string, TimetableEntry[]>) {
    const times: Record<string, { start: string; end: string }> = {};

    for (const day in grouped) {
        const entries = grouped[day];
        if (!entries?.length) continue;

        const startTimes = entries
            .map((e) => e.Start)
            .sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

        const endTimes = entries
            .map((e) => e.End)
            .sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

        times[day] = { start: startTimes[0], end: endTimes[endTimes.length - 1] };
    }

    return times;
}

export function computeGlobalTimeRange(grouped: Record<string, TimetableEntry[]>) {
    let minStartMin = Infinity;
    let maxEndMin = -Infinity;

    for (const day in grouped) {
        const entries = grouped[day];
        if (!entries?.length) continue;

        for (const entry of entries) {
            const startMin = timeToMinutes(entry.Start);
            const endMin = timeToMinutes(entry.End);
            minStartMin = Math.min(minStartMin, startMin);
            maxEndMin = Math.max(maxEndMin, endMin);
        }
    }

    if (minStartMin === Infinity || maxEndMin === -Infinity) {
        return { startHour: 8, endHour: 18 };
    }

    const startHour = Math.floor(minStartMin / 60);
    const endHour = Math.ceil(maxEndMin / 60);

    return { startHour, endHour };
}
