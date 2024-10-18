import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthContext } from "@/hooks/use-auth";
import useScreenSize from "@/hooks/use-screen-size";
import { isWorkEnabledAtom } from "@/lib/atoms/atoms";
import { useGetWorkStatus } from "@/lib/hooks/queries/use-get-work-status";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

interface RouterContext {
    auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: Root,
});

const ScreenSizeIndicator = () => {
    const s = useScreenSize();

    return <div className="fixed bottom-20 right-6 z-50">{s}</div>;
};

// TODO : Not sure where to put this stuff
const WorkStatus = () => {
    const [_, setIsWorkEnabled] = useAtom(isWorkEnabledAtom);

    const { data: workStatus } = useGetWorkStatus();

    useEffect(() => {
        if (workStatus) {
            setIsWorkEnabled(workStatus.is_enabled);
        }
    }, [workStatus]);

    return null;
};

function Root() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Nav />
                <ScreenSizeIndicator />
                <Outlet />
                <WorkStatus />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />

            {/* <TanStackRouterDevtools /> */}
            <Toaster />
        </>
    );
}
