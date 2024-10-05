import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAddUserToGroup } from "@/lib/hooks/mutations/use-add-user-to-group";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useGetInviteLinkWithToken } from "@/lib/hooks/queries/use-get-invite-link-with-token";
import { useAuth } from "@/lib/hooks/use-auth";
import SpinnerButton from "@/spinner-button";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

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

function InviteLink() {
    const { session } = useAuth();
    const { token } = Route.useSearch();
    const { data, isLoading, isError } = useGetInviteLinkWithToken({
        token: token,
        enabled: !!token && !!session,
    });

    const { mutateAsync: addUserToGroup, isPending } = useAddUserToGroup();
    // TODO : not group user but us
    const {
        data: groupUser,
        isLoading: isGroupUserLoading,
        isError: isGroupUserError,
    } = useGetGroupUser({
        groupID: data?.group_id,
        userID: session?.user.id,
        enabled: !!data && !!session,
    });
    const navigate = useNavigate();

    if (!token) {
        return <div>No token provided.</div>;
    }

    // If we have data but its missing the group then error
    if (isError || (data && !data.group)) {
        return <div>Something went wrong.</div>;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (!data && session) {
        return <div>Token doesn't seem to exist.</div>;
    }

    const handleJoinGroup = () => {
        if (!data || !session) return;

        addUserToGroup(
            [{ group_id: data.group_id, user_id: session.user.id }],
            {
                onSuccess() {
                    toast({
                        title: "Successfully joined group.",
                    });
                    navigate({
                        to: "/groups/$groupID",
                        params: { groupID: data.group_id },
                    });
                },
                onError(error) {
                    toast({
                        title: "Failed to join group.",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            }
        );
    };

    console.log(groupUser);

    const isSignedIn = session;
    return (
        <div className="flex justify-center items-center flex-col pt-12">
            <div>
                {isSignedIn && (
                    <div className="grid grid-cols-2">
                        <div className="w-[10rem] h-[10rem] rounded-sm bg-red-500"></div>
                        <div className="pl-3 flex flex-col justify-between">
                            <div>
                                <h1>You've been invited!</h1>
                                <div>by: {data?.group?.creator_id}</div>
                                <div>to join: {data?.group?.name}</div>
                            </div>
                            {groupUser ? (
                                <div className="relative">
                                    <Link
                                        to="/groups/$groupID"
                                        params={{
                                            groupID: data?.group_id ?? "",
                                        }}
                                    >
                                        <Button className="w-full">
                                            View group
                                        </Button>
                                    </Link>
                                    <div className="absolute -bottom-6 text-xs text-muted-foreground pl-2">
                                        You're already in this group.
                                    </div>
                                </div>
                            ) : (
                                <SpinnerButton
                                    isPending={isPending || isGroupUserLoading}
                                    disabled={isPending || isGroupUserLoading}
                                    onClick={handleJoinGroup}
                                >
                                    Join group
                                </SpinnerButton>
                            )}
                        </div>
                    </div>
                )}
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
