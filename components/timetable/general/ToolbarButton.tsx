"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type ButtonBaseProps = React.ComponentPropsWithoutRef<typeof Button>;

type ToolbarButtonProps = ButtonBaseProps & {
    icon: React.ReactNode;
    label: React.ReactNode;
    subLabel?: React.ReactNode;
};

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ icon, label, subLabel, className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant="outline"
                className={
                    className ??
                    "h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-left"
                }
                {...props}
            >
                <span className="shrink-0 opacity-80">{icon}</span>

                <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-tight truncate">{label}</span>
                    {subLabel ? (
                        <span className="block text-xs text-muted-foreground leading-tight truncate">
              {subLabel}
            </span>
                    ) : null}
        </span>
            </Button>
        );
    }
);

ToolbarButton.displayName = "ToolbarButton";
