import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/groups")({
    component: Groups,
});

function Groups() {
    const { session, signOut } = useAuth();
    const navigate = useNavigate({ from: "/groups" });

    return (
        <div className="bg-red-500">
            fds
            <div>Hello /groups!</div>
            <div>
                <Button
                    onClick={() => {
                        signOut();
                        navigate({ to: "/" });
                    }}
                    disabled={session == null}
                >
                    sign out
                </Button>
            </div>
        </div>
    );
}
