"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function ResponsivePicker({
                                     isDesktop,
                                     open,
                                     onOpenChange,
                                     trigger,
                                     title,
                                     children,
                                     desktopContentClassName,
                                     showDesktopFooterClose = true,
                                 }: {
    isDesktop: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: React.ReactNode;
    title: string;
    children: React.ReactNode;
    desktopContentClassName?: string;
    showDesktopFooterClose?: boolean;
}) {
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className={desktopContentClassName ?? "max-w-md max-h-[500px] overflow-auto"}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>

                    {children}

                    {showDesktopFooterClose && (
                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>

            <SheetContent side="bottom" className="h-[85vh] w-full p-0">
                <div className="flex h-full flex-col">
                    <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
                        <SheetTitle>{title}</SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2">{children}</div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
