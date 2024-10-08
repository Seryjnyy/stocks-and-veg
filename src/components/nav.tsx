import { useAuth } from "@/lib/hooks/use-auth";
import {
    Link,
    useLocation,
    useNavigate,
    useRouter,
} from "@tanstack/react-router";
import React from "react";
import { Button } from "./ui/button";
import { User2 } from "lucide-react";

export default function Nav() {
    const { session, signOut, profile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = () => {
        signOut();
        if (location.pathname != "auth") {
            navigate({ to: "/" });
        }
    };

    return (
        <nav className="w-full flex justify-between items-center p-4 bg-gray-700">
            <div className="flex items-center gap-4">
                <Link to="/">tomatoe</Link>
                <Link to="/groups">groups</Link>
            </div>
            <div>
                {session ? (
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 border border-dashed rounded-lg px-3">
                            <Link to="/profile">
                                <User2 className="size-4" />
                            </Link>
                            {profile?.username}
                        </span>
                        <Button onClick={handleSignOut}>Logout</Button>
                    </div>
                ) : (
                    <Link to="/auth" disabled={location.pathname == "/auth"}>
                        Sign in/Sign up
                    </Link>
                )}
            </div>
        </nav>
    );
}
