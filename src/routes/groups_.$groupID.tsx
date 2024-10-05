import DataError from "@/components/data-error";
import GroupTasks from "@/components/group/group-tasks";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useCreateInviteLink } from "@/lib/hooks/mutations/use-create-invite-link";
import { useGetUserGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupUsers } from "@/lib/hooks/queries/use-get-group-users";
import { useGetInviteLink } from "@/lib/hooks/queries/use-get-invite-link";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { useAuth } from "@/lib/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groups/$groupID")({
    component: Group,
});

const GroupUser = ({ user }: { user: Tables<"group_user"> }) => {
    const { session } = useAuth();

    const {
        data: profile,
        isError,
        isLoading,
    } = useGetUserProfile({ user_id: user.user_id });

    if (isError) {
        return <DataError message="Couldn't fetch user data." />;
    }

    if (isLoading) {
        return <div className="w-full bg-orange-400">...loading</div>;
    }

    if (profile == null) {
        return <DataError message="User data is missing." />;
    }

    const isUs = session?.user.id == profile.user_id;

    return (
        <div className="w-full p-4 border rounded-sm">
            <span>{profile.username}</span>
            <span>{isUs ? "Us" : "Not us"}</span>
        </div>
    );
};

const GroupUsersList = ({ users }: { users: Tables<"group_user">[] }) => {
    return users.map((user) => <GroupUser user={user} key={user.id} />);
};

const GroupUsers = ({ groupID }: { groupID: string }) => {
    const { data, error } = useGetGroupUsers({
        groupID: groupID,
    });

    if (error) {
        return <div>error</div>;
    }

    return (
        <div className="border p-4">
            <h3>Group users</h3>
            <ul>
                <GroupUsersList users={data || []} />
            </ul>
            <span>{(data || []).length}</span>
        </div>
    );
};

const Invite = ({ groupID }: { groupID: string }) => {
    const { data, isError, isLoading } = useGetInviteLink({ groupID: groupID });
    const { mutateAsync: createInviteLink, isPending } = useCreateInviteLink();

    if (data) {
        const now = new Date();
        const expiresAt = new Date(data.expires_at);

        if (now > expiresAt) {
            console.log("Link has expired.");
        } else {
            console.log("Link is still good.");
        }
    }

    const isInviteLinkExpired = data
        ? new Date() > new Date(data.expires_at)
        : false;

    return (
        <div className="p-4 border">
            <h3 className="text-xl">Invite</h3>
            {/* <span>Expires in 1 day.</span>
            <span>{data?.expires_at}</span> */}

            <div>
                {!data && <div>doesn't exist</div>}
                {data && (
                    <div>
                        {isInviteLinkExpired && (
                            <div className="text-sm text-muted-foreground">
                                Old invite link has expired. Please generate a
                                new one.
                            </div>
                        )}
                        exists
                    </div>
                )}
            </div>

            {/* <div>
                {data ? (
                    "exists"
                ) : (
                    <Button
                        onClick={() => {
                            createInviteLink([
                                {
                                    group_id: groupID,
                                    token: "",
                                    expires_at: new Date().toISOString(),
                                },
                            ]);
                        }}
                    >
                        Create invite link
                    </Button>
                )}
            </div> */}
        </div>
    );
};

// TODO : is it better to drill stuff like session, or let components use useAuth hook?
function Group() {
    const { groupID } = Route.useParams();
    const { session } = useAuth();
    const { data, error, isLoading } = useGetUserGroup({
        session: session,
        groupID: groupID,
    });

    if (error) {
        return <DataError message={error.message} />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data == null) {
        return <DataError message="Group data is missing." />;
    }

    return (
        <div className="p-12 space-y-8">
            <h1 className="font-bold text-3xl">{data.name}</h1>

            {session?.user.id == data?.creator_id
                ? "we created"
                : "we not created"}

            <GroupUsers groupID={groupID} />
            <GroupTasks groupID={groupID} />
            <Invite groupID={groupID} />
        </div>
    );
}
