import { Button } from "@/components/ui/button";
import { useUploadAvatar } from "@/lib/hooks/mutations/use-upload-avatar";
import { useAuth } from "@/hooks/use-auth";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    const { session } = useAuth();

    return (
        <div className="flex justify-center h-screen items-center flex-col">
            <h3>Welcome {session?.user.email} to stocks and veg!</h3>
            <div>
                <Link to="/groups">groups</Link>
            </div>
        </div>
    );
}
