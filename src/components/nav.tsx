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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserAvatar } from "./group/group-user-profile";

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
        <header className=" ">
            {/* <div className="flex items-center justify-between px-4 py-2">
    <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
    </div>
    <div className="flex items-center space-x-4">
        <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-64"
            />
        </div>
        <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
            <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
            />
            <AvatarFallback className="bg-red-400"></AvatarFallback>
        </Avatar>
    </div>
</div> */}
            <Navbar />
        </header>
    );

    return (
        <nav className="w-full flex justify-between items-center p-1 backdrop-blur-lg bg-secondary/25 fixed top-0 left-0 z-50">
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

const Navbar = () => {
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
                            className="flex-shrink-0 flex items-center border-x justify-center "
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
                    {/* <div className="flex items-center text-muted-foreground font-bold">
                        <span>some group</span>
                    </div> */}
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
                                        <span className="ml-2">
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
                                <div className="pt-5 pb-6 px-5">
                                    <div className="mt-6">
                                        <nav className="grid gap-y-8">
                                            <Link
                                                to="/groups"
                                                className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                                            >
                                                <span className="ml-3 text-base font-medium text-gray-900">
                                                    Groups
                                                </span>
                                            </Link>
                                        </nav>
                                    </div>
                                </div>
                                <div className="py-6 px-5 space-y-6">
                                    {isLoggedIn ? (
                                        <div className="space-y-6">
                                            <span className="text-base font-medium text-gray-900">
                                                {profile?.username}
                                            </span>
                                            <Link to="/profile">
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    Profile
                                                </Button>
                                            </Link>
                                            <Button
                                                className="w-full"
                                                onClick={handleSignOut}
                                            >
                                                Log out
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button
                                                className="w-full"
                                                onClick={handleSignIn}
                                            >
                                                Log in
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
};
