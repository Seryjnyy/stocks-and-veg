import BackButton from "@/components/back-button";
import DataError from "@/components/data-error";
import { UserAvatar, UserDetail } from "@/components/group/group-user-profile";
import Loading from "@/components/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useGetGroupUsers } from "@/lib/hooks/queries/use-get-group-users";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { Tables } from "@/lib/supabase/database.types";
import supabase from "@/lib/supabase/supabaseClient";
import SpinnerButton from "@/spinner-button";
import { ArrowDownIcon, EnterIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangleIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/invite-link")({
    component: InviteLink,
    validateSearch: (search: { token?: string } & unknown) => {
        const token = search.token;
        if (typeof token != "string") {
            return {};
        }

        return { token: token };
    },
});

const Error = ({ message }: { message?: string }) => {
    const { session } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            {session && (
                <Link to="/groups">
                    <BackButton title="Groups" />
                </Link>
            )}
            {!session && (
                <Link to="/">
                    <BackButton title="Home" />
                </Link>
            )}
            <div>Something went wrong.</div>
            {message && <DataError message={message} className="w-[20rem]" />}
        </div>
    );
};

const Join = ({
    inviteLinkData,
}: {
    inviteLinkData: Tables<"invite_link">;
}) => {
    const [isJoinPending, setIsJoinPending] = useState(false);
    const { session } = useAuth();
    const {
        data: groupUser,
        isLoading,
        isError,
        refetch,
    } = useGetGroupUser({
        groupID: inviteLinkData.group_id,
        userID: session?.user.id,
        enabled: inviteLinkData && !!session,
    });
    const { refetch: refetchGroup } = useGetGroup({
        groupID: inviteLinkData.group_id,
    });
    const { refetch: refetchGroupUsers } = useGetGroupUsers({
        groupID: inviteLinkData.group_id,
    });

    const navigate = useNavigate();

    if (isLoading) {
        return <Skeleton className="w-full h-10" />;
    }

    if (isError) {
        return (
            <DataError message="Failed to check if you're in the group. Please try again later." />
        );
    }

    const handleJoinGroup = async () => {
        if (!inviteLinkData || !session) return;

        setIsJoinPending(true);
        const res = await supabase.rpc("join_group", {
            p_user_id: session.user.id,
            p_group_id: inviteLinkData.group_id,
            p_token: inviteLinkData.token,
        });

        if (res.error) {
            toast({
                title: "Failed to join group.",
                description: res.error.message,
                variant: "destructive",
            });
            refetch();
            setIsJoinPending(false);
        } else {
            setIsJoinPending(false);

            // TODO:  We fetch group user data for this user here, if not in group then its null
            // unless we refetch here before going to group page, because of the cache the data will remain null
            // So should invalidate the data (idk how to do it with cache helpers tho )
            // This also why user is not navigated to group, or get the option to do so until group user data is refetched
            // TODO : ideally all group data would be refreshed at least once when navigating to group page
            refetch();
            // This is precautionary measure, if user just left the group and is coming back
            refetchGroup();
            refetchGroupUsers();

            toast({
                title: "Successfully joined group.",
            });
            navigate({
                to: "/groups/$groupID",
                params: { groupID: inviteLinkData.group_id },
            });
        }
    };

    if (groupUser) {
        return (
            <div className="relative">
                <Link
                    to="/groups/$groupID"
                    params={{
                        groupID: groupUser.group_id,
                    }}
                >
                    <Button className="w-full">
                        <EyeIcon className="mr-2 size-3" />
                        View group
                    </Button>
                </Link>
                <div className="absolute -bottom-6 text-xs text-muted-foreground pl-2">
                    You're already in this group.
                </div>
            </div>
        );
    }

    const isInviteLinkUsed = inviteLinkData.used ?? false;
    const isInviteLinkExpired =
        new Date() > new Date(inviteLinkData.expires_at);

    return (
        <div className="space-y-4">
            <SpinnerButton
                isPending={isJoinPending}
                disabled={
                    isJoinPending || isInviteLinkUsed || isInviteLinkExpired
                }
                onClick={handleJoinGroup}
                className="w-full"
            >
                <EnterIcon className="mr-2 size-3" /> Join group
            </SpinnerButton>
            {(isInviteLinkUsed || isInviteLinkExpired) && (
                <Alert variant={"warning"}>
                    <AlertTitle className="flex items-center">
                        <AlertTriangleIcon className="mr-2 size-3" />
                        {isInviteLinkUsed
                            ? "Invite link used"
                            : isInviteLinkExpired
                              ? "Invite link expired"
                              : ""}
                    </AlertTitle>
                    <AlertDescription>
                        {isInviteLinkUsed
                            ? "This invite link has already been used."
                            : isInviteLinkExpired
                              ? "This invite link has expired."
                              : ""}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

const InviterProfile = ({ inviterID }: { inviterID: string }) => {
    const {
        data: user,
        isLoading,
        isError,
    } = useGetUserProfile({ user_id: inviterID });

    if (isLoading) {
        return <Skeleton className="w-10 h-10 rounded-full" />;
    }

    if (!user || isError) return null;
    return (
        <div className="pt-4">
            <span className="text-muted-foreground">Invited by:</span>
            <div className="flex items-center gap-2 border border-dashed p-1 rounded-lg">
                <UserAvatar user={user} size={"sm"} />
                <UserDetail user={user} />
            </div>
        </div>
    );
};

const GroupInfo = ({ groupID }: { groupID: string }) => {
    const {
        data: group,
        isLoading,
        isError,
    } = useGetGroup({
        groupID: groupID,
    });

    if (isLoading) {
        return <Skeleton className="w-full h-10" />;
    }

    if (isError) {
        return <DataError message="Failed to fetch group data." />;
    }
    if (!group) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            <div className="w-[10rem] h-[10rem] rounded-sm bg-gradient-to-tr from-blue-300 to-blue-500"></div>
            <div className=" flex flex-col justify-between ">
                <div>
                    <h1 className="text-3xl font-semibold">
                        You've been invited!
                    </h1>
                    <div>
                        <span className="text-muted-foreground">to join:</span>{" "}
                        <span className="font-semibold text-blue-300 max-w-[20rem] break-words">
                            {group.name}{" "}
                        </span>
                    </div>
                    <div>
                        <InviterProfile inviterID={group.creator_id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

function InviteLink() {
    const { session } = useAuth();
    const { token } = Route.useSearch();
    const [inviteLinkData, setInviteLinkData] =
        useState<Tables<"invite_link"> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!token || !session) return;

        setIsLoading(true);
        supabase
            .rpc("get_invite", {
                p_token: token,
            })
            .maybeSingle()
            // .returns<GetInviteResult>()
            .then((res) => {
                console.log(res.data);
                setIsLoading(false);

                if (res.data) {
                    if (res.data) {
                        setInviteLinkData(res.data);
                    } else {
                        setIsError(true);
                    }
                }

                if (res.error) {
                    setIsError(true);
                }
            });
    }, [session, token]);

    if (!token) {
        return <Error message="No token provided." />;
    }

    if (isError) {
        return <Error message="Failed to fetch invite link data." />;
    }

    if (isLoading) {
        return <Loading variant={"page"} />;
    }

    if (!inviteLinkData) {
        return <Error message="Failed to fetch invite link data." />;
    }

    const isSignedIn = session;
    return (
        <div className="flex justify-center items-center flex-col pt-12 ">
            <Link to="/groups" className="place-self-start pl-6 md:pl-12 mb-12">
                <BackButton title="Back" />
            </Link>
            <div className="space-y-16 px-4 ">
                <GroupInfo groupID={inviteLinkData.group_id} />
                <Join inviteLinkData={inviteLinkData} />
            </div>
            <div>
                {!isSignedIn && (
                    <div className="grid grid-cols-1">
                        <div className="pl-3 flex flex-col justify-between">
                            <div>
                                <span>
                                    It looks like you're not signed in, please
                                    sign in or sign up to join this group.
                                </span>
                                <ArrowDownIcon className="mx-auto" />
                            </div>
                            <Link
                                to="/auth"
                                search={{
                                    redirect: `invite-link?token=${token}`,
                                }}
                            >
                                <Button className="w-full">
                                    Sign in or Sign up
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
