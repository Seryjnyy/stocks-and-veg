import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/groups")({
    beforeLoad: async ({ location, context }) => {
        console.log(context);
        if (context.auth?.session == null) {
            throw redirect({
                to: "/auth",
                search: {
                    redirect: location.href,
                },
            });
        }
    },
});
