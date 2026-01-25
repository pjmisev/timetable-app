"use client";

import React from "react";

export function EmptyState({
                               icon,
                               children,
                               className,
                           }: {
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={
                className ??
                "flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
            }
        >
            {icon}
            <div className="mt-4">{children}</div>
        </div>
    );
}
