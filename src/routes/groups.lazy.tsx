import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupCreate from "@/components/groups/group-create";
import { Button } from "@/components/ui/button";
import { useCreateGroup } from "@/lib/hooks/mutations/use-create-group";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { useGetUserGroups } from "@/lib/hooks/queries/use-get-user-groups";
import { useAuth } from "@/lib/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import { timestampSplit } from "@/lib/utils";
import {
    createLazyFileRoute,
    Link,
    Outlet,
    useNavigate,
} from "@tanstack/react-router";
import { CONFIG } from "@/lib/config";

export const Route = createLazyFileRoute("/groups")({
    component: GroupsTabs,
});

const Group = ({ group }: { group: Tables<"group"> }) => {
    const { data: creatorProfile } = useGetUserProfile({
        user_id: group.creator_id,
    });

    return (
        <div className="w-full border p-4 rounded-sm">
            <div className="flex flex-col">
                <span>{group.name}</span>
                <span>{timestampSplit(group.created_at).dateTime}</span>
                <span>{creatorProfile?.username ?? "missing_data"}</span>
            </div>
            <Link to={`/groups/$groupID`} params={{ groupID: group.id }}>
                <Button>Check out</Button>
            </Link>
        </div>
    );
};

const GroupsList = ({ groups }: { groups: Tables<"group">[] }) => {
    return groups.map((group) => (
        <li key={group.id}>
            <Group group={group} />
        </li>
    ));
};

const Groups = () => {
    const { session } = useAuth();
    const {
        data: groups,
        error,
        refetch,
    } = useGetUserGroups({
        user_id: session?.user.id,
    });

    if (error) {
        return null;
    }

    return (
        <div>
            <h1>Groups</h1>
            <ul className="border p-2 w-full">
                <GroupsList groups={groups || []} />
            </ul>
            <span>
                {(groups || []).length}/{CONFIG.maxGroups}
            </span>
            <Button onClick={() => refetch()}>Refresh</Button>
        </div>
    );
};

function GroupsTabs() {
    return (
        <div className="flex justify-center items-center flex-col">
            <Tabs defaultValue="groups" className="w-full">
                <TabsList>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                    <TabsTrigger value="create-group">Create group</TabsTrigger>
                </TabsList>
                <TabsContent value="groups">
                    <Groups />
                </TabsContent>
                <TabsContent value="create-group">
                    <GroupCreate />
                </TabsContent>
            </Tabs>
        </div>
    );
}
