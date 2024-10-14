import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export default function useScreenSize() {
    const queries = {
        xs: "(min-width: 480px)",
        sm: "(min-width: 640px)",
        md: "(min-width: 768px)",
        lg: "(min-width: 1024px)",
        xl: "(min-width: 1280px)",
    };

    const isXs = useMediaQuery({
        query: queries.xs,
    });
    const isSm = useMediaQuery({
        query: queries.sm,
    });
    const isMd = useMediaQuery({
        query: queries.md,
    });
    const isLg = useMediaQuery({
        query: queries.lg,
    });
    const isXl = useMediaQuery({
        query: queries.xl,
    });

    const screenSize = useMemo(() => {
        if (isXl) return "xl";
        if (isLg) return "lg";
        if (isMd) return "md";
        if (isSm) return "sm";
        if (isXs) return "xs";
        return "xs";
    }, [isXs, isSm, isMd, isLg, isXl]);

    return screenSize;
}
