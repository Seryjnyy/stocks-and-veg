import Nav from "@/components/nav";
import AuthProvider, { AuthContext, AuthState } from "@/lib/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
    createRootRoute,
    createRootRouteWithContext,
    Link,
    Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface RouterContext {
    auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: Root,
});

const queryClient = new QueryClient();

function Root() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Nav />
                <Outlet />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>

            <TanStackRouterDevtools />
        </>
    );
}
