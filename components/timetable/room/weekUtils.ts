export function normalizeWeekValue(value: string) {
    if (!value) return "";

    if (value === "current") return "1";
    if (value === "next") return "2";
    if (value.startsWith("week-")) return value.replace("week-", "");

    return value;
}
