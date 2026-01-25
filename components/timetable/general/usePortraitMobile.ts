"use client";

import * as React from "react";

export function usePortraitMobile(maxWidth = 640) {
    const [isPortraitMobile, setIsPortraitMobile] = React.useState(false);

    React.useEffect(() => {
        const mqlSmall = window.matchMedia(`(max-width: ${maxWidth}px)`);
        const mqlPortrait = window.matchMedia("(orientation: portrait)");

        const update = () => setIsPortraitMobile(mqlSmall.matches && mqlPortrait.matches);

        update();

        const add = (mql: MediaQueryList) => {
            if (mql.addEventListener) mql.addEventListener("change", update);
            else mql.addListener(update as any);
        };
        const remove = (mql: MediaQueryList) => {
            if (mql.removeEventListener) mql.removeEventListener("change", update);
            else mql.removeListener(update as any);
        };

        add(mqlSmall);
        add(mqlPortrait);

        return () => {
            remove(mqlSmall);
            remove(mqlPortrait);
        };
    }, [maxWidth]);

    return isPortraitMobile;
}
