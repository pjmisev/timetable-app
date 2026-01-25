"use client";

import * as React from "react";

export function useIsDesktop(breakpoint = 640) {
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
        const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
            setIsDesktop("matches" in e ? e.matches : (e as MediaQueryList).matches);

        // initial
        setIsDesktop(mql.matches);

        // subscribe (support older Safari)
        if (mql.addEventListener) mql.addEventListener("change", onChange as any);
        else mql.addListener(onChange as any);

        return () => {
            if (mql.removeEventListener) mql.removeEventListener("change", onChange as any);
            else mql.removeListener(onChange as any);
        };
    }, [breakpoint]);

    return isDesktop;
}
