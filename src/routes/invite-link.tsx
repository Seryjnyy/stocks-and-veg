import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/invite-link")({
    component: () => <div>Hello /invite-link!</div>,
});
