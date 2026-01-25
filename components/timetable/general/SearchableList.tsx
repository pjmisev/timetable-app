"use client";

import React from "react";
import { Input } from "@/components/ui/input";

export function SearchableList({
                                   value,
                                   onChange,
                                   placeholder,
                                   autoFocus,
                                   items,
                                   selectedId,
                                   onSelect,
                                   emptyText = "No results found",
                                   fullHeightMobile = false,
                               }: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    autoFocus?: boolean;
    items: { id: string; label: string }[];
    selectedId?: string;
    onSelect: (id: string) => void;
    emptyText?: string;
    fullHeightMobile?: boolean;
}) {
    return (
        <>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus={autoFocus}
                className="mb-4 shrink-0"
            />

            <ul
                className={
                    fullHeightMobile
                        ? "flex-1 min-h-0 overflow-auto border rounded-md border-gray-200"
                        : "max-h-72 overflow-auto border rounded-md border-gray-200"
                }
            >
                {items.length === 0 && (
                    <li className="px-3 py-2 text-muted-foreground">{emptyText}</li>
                )}

                {items.map((it) => (
                    <li
                        key={it.id}
                        onClick={() => onSelect(it.id)}
                        className={`cursor-pointer px-3 py-2 border-b last:border-b-0 hover:bg-primary hover:text-white ${
                            it.id === selectedId ? "font-bold" : ""
                        }`}
                    >
                        {it.label}
                    </li>
                ))}
            </ul>
        </>
    );
}
