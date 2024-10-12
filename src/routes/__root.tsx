import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthContext } from "@/hooks/use-auth";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface RouterContext {
    auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: Root,
});

function Root() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Nav />

                <Outlet />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />

            {/* <TanStackRouterDevtools /> */}
            <Toaster />
        </>
    );
}
