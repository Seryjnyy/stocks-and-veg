import { useAuth } from "@/hooks/use-auth";
import { TOMATO_EMOJI } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { User2 } from "lucide-react";
import { Button } from "./ui/button";

import { Menu } from "lucide-react";

import { LogOut, User } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { UserAvatar, UserDetail } from "./group/group-user-profile";

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

    // TODO : for now nav, but turn into links, with param for which to display sign up or sign in
    const handleSignIn = () => {
        navigate({ to: "/auth" });
    };
    const handleSignUp = () => {
        navigate({ to: "/auth" });
    };
    const isLoggedIn = !!session;
    return (
        <nav className="border-b bg-[#0f0f10]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center border-x justify-center hover:bg-muted/50 "
                        >
                            <span className="h-8 w-8 flex justify-center items-center ">
                                {TOMATO_EMOJI}
                            </span>
                        </Link>

                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/groups"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-foreground hover:border-foreground/50 hover:text-foreground/50"
                            >
                                Groups
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="ml-3 relative"
                                    >
                                        {profile && (
                                            <UserAvatar
                                                user={profile}
                                                size={"xs"}
                                            />
                                        )}
                                        <span className="ml-2 max-w-[5rem] truncate">
                                            {profile?.username}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <Link to="/profile">
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div>
                                <Button variant="ghost" onClick={handleSignIn}>
                                    Log in
                                </Button>
                                <Button className="ml-3" onClick={handleSignUp}>
                                    Sign up
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center sm:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                >
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <Menu
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">
                                        Navigation menu
                                    </SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Navigate to some page and view your log
                                        in status.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="pt-5 pb-6 px-5">
                                    <div className="mt-6">
                                        <h2 className="text-2xl text-muted-foreground">
                                            Links
                                        </h2>
                                        <nav className="grid gap-y-8 pt-3">
                                            <Link to="/groups">
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    Groups
                                                </Button>
                                            </Link>
                                        </nav>
                                    </div>
                                </div>
                                <div className="py-6 px-5">
                                    <h2 className="text-2xl text-muted-foreground">
                                        User
                                    </h2>
                                    {isLoggedIn ? (
                                        <div className="flex flex-col gap-3 pt-3">
                                            {profile && (
                                                <div className="flex items-start gap-4 border border-dashed rounded-lg p-3">
                                                    <UserAvatar
                                                        user={profile}
                                                        size={"lg"}
                                                    />
                                                    <UserDetail
                                                        user={profile}
                                                        size={"lg"}
                                                    />
                                                </div>
                                            )}

                                            <Link
                                                to="/profile"
                                                className="h-fit "
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    Profile
                                                </Button>
                                            </Link>

                                            <Button
                                                className="w-full"
                                                onClick={handleSignOut}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log out
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className=" pt-3">
                                            <Button
                                                className="w-full"
                                                onClick={handleSignIn}
                                            >
                                                Sign in
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="mt-3 w-full"
                                                onClick={handleSignOut}
                                            >
                                                Sign up
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
