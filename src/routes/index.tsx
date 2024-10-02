import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    validateSearch: (search: { redirect?: string } & unknown) => {
        const redirect = search.redirect;
        if (typeof redirect != "string") {
            return {};
        }

        return { redirect: redirect };
    },
});
