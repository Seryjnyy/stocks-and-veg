import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/profile")({
    component: UserProfile,
});

function Profile() {
    return (
        <div>
            <div>change username</div>
            <div>
                <Button>Log out</Button>
                <Button>Change avatar</Button>
                <Button>Delete data (tasks/completions/stats/proofs)</Button>
                <Button>Delete account</Button>
            </div>
        </div>
    );
}

function UserProfile() {
    const [username, setUsername] = useState("johndoe");
    const [avatarUrl, setAvatarUrl] = useState(
        "/placeholder.svg?height=100&width=100"
    );

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        // Implement logout logic here
        console.log("Logging out...");
    };

    const handleDeleteData = () => {
        // Implement data deletion logic here
        console.log("Deleting user data...");
    };

    const handleDeleteAccount = () => {
        // Implement account deletion logic here
        console.log("Deleting account...");
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">User Profile</h1>

            <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback>
                        {username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">{username}</h2>
                    <p className="text-sm text-muted-foreground">
                        Member since: January 1, 2023
                    </p>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </div>
                <Button>Save Changes</Button>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <Button variant="outline" onClick={handleLogout}>
                    Log Out
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Data</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to delete your data?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteData}>
                                Delete Data
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to delete your account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount}>
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
