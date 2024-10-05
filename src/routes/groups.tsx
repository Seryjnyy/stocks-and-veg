import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/groups")({
    beforeLoad: async ({ location, context }) => {
        console.log(context);
        if (context.auth?.session == null && context.auth.isLoading == false) {
            throw redirect({
                to: "/auth",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
});
