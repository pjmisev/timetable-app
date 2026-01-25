export type Option = { id: string; name: string; departmentId?: string };

export interface TimetableEntry {
    Day: string;
    Description: string;
    Type: string;
    Weeks: string;
    Start: string;
    End: string;
    Staff: string;
    Location: string;
}

export interface WeekOption {
    value: string;
    label: string;
    weekNumber?: number;
}

export interface SavedClassResponse {
    savedDepartment: string;
    savedClass: string;
}
