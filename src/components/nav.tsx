import { useAuth } from "@/lib/hooks/use-auth";
import {
    Link,
    useLocation,
    useNavigate,
    useRouter,
} from "@tanstack/react-router";
import React from "react";
import { Button } from "./ui/button";

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
                    <>
                        {profile?.username}
                        <Button onClick={handleSignOut}>Logout</Button>
                    </>
                ) : (
                    <Link to="/auth" disabled={location.pathname == "/auth"}>
                        Sign in/Sign up
                    </Link>
                )}
            </div>
        </nav>
    );
}
