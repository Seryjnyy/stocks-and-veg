import { UserAvatar } from "@/components/group/group-user-profile";
import EditUserAvatar from "@/components/profile/edit-user-avatar";
import SpinnerButton from "@/components/spinner-button";
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
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUpdateUsername } from "@/hooks/supabase/profile/use-update-username";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/lib/supabase/database.types";
import { timestampSplit } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/profile")({
    component: UserProfile,
});

const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters long" })
        .regex(/^(?!\s*$).+/, {
            message: "Username cannot be just whitespace",
        }),
});

const UpdateUsernameForm = ({ profile }: { profile: Tables<"profile"> }) => {
    const { toast } = useToast();
    const { mutateAsync: updateUsername, isPending } = useUpdateUsername();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: profile?.username || "",
        },
    });

    console.log("PROFILE", profile);

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);

        if (!profile) return;

        updateUsername(
            { ...profile, username: values.username },
            {
                onSuccess: () => {
                    toast({
                        title: "Successfully updated username.",
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Something went wrong.",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            }
        );
    }

    console.log(form.getValues().username === profile?.username);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Username
                                {form.getValues().username !=
                                    profile?.username && (
                                    <span className="text-yellow-600">*</span>
                                )}
                            </FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <SpinnerButton
                    isPending={isPending}
                    disabled={
                        form.getValues().username === profile?.username ||
                        isPending
                    }
                    type="submit"
                    variant="outline"
                >
                    <Save className="size-3 mr-2" /> Save
                </SpinnerButton>
            </form>
        </Form>
    );
};

function UserProfile() {
    const { profile } = useAuth();

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
            <h1 className="text-2xl font-bold">Profile</h1>

            <div className="flex items-center space-x-4">
                {profile && <UserAvatar user={profile} size={"7xl"} />}
                <div>
                    <h2 className="text-xl font-semibold">
                        {profile?.username}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Member since:{" "}
                        {profile && timestampSplit(profile?.created_at).date}
                    </p>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>{profile && <UpdateUsernameForm profile={profile} />}</div>
                <div>
                    <Label htmlFor="edit-avatar">Avatar</Label>
                    <div id="edit-avatar" className="pt-2">
                        <EditUserAvatar />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="size-3 mr-2" /> Log Out
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
