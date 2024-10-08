import GroupCreate from "@/components/groups/group-create";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CONFIG } from "@/lib/config";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { useGetGroupUserTasks } from "@/lib/hooks/queries/use-get-group-user-tasks";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { useGetUserGroups } from "@/lib/hooks/queries/use-get-user-groups";
import { useAuth } from "@/lib/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import { timestampSplit } from "@/lib/utils";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/groups")({
    component: GroupsTabs,
});

const GroupTomato = ({ group }: { group: Tables<"group"> }) => {
    const { data, isError, isLoading } = useGetGroupTomatoes({
        groupID: group.id,
    });

    return (
        <div className="flex flex-col border px-4 py-3 w-fit">
            <h3 className="relative">
                Tomatoes
                {false && (
                    <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full absolute"></span>
                )}
            </h3>
            {data?.length}
        </div>
    );
};

// TODO : make better
const GroupTasksToday = ({ group }: { group: Tables<"group"> }) => {
    const { session } = useAuth();
    const { data: groupUserTasks } = useGetGroupUserTasks({
        groupID: group.id,
        userID: session?.user.id ?? "",
        enabled: !!session,
    });

    const completed =
        groupUserTasks?.filter((task) => task.task_completion.length > 0) || [];

    return (
        <div className="flex flex-col border px-4 py-3 w-fit">
            <h3 className="relative">
                Tasks
                {completed.length != groupUserTasks?.length && (
                    <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full absolute"></span>
                )}
            </h3>
            {completed?.length}/{groupUserTasks?.length}
        </div>
    );
};

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
            <GroupTasksToday group={group} />
            <GroupTomato group={group} />
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
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold">Groups</h1>
                <div>Time left today: 12:32</div>
            </div>
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
