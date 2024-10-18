import DataError from "@/components/data-error";
import {
    GroupUserAvatar,
    UserAvatar,
} from "@/components/group/group-user-profile";
import GroupCreateModal from "@/components/groups/group-create-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { CONFIG } from "@/lib/config";
import { useGetGroupUserTasks } from "@/hooks/supabase/group/use-get-group-user-tasks";
import { useGetGroupUsers } from "@/hooks/supabase/group/use-get-group-users";
import { useGetUserProfile } from "@/hooks/supabase/profile/use-get-profile";
import { useGetUserGroups } from "@/hooks/supabase/groups/use-get-user-groups";
import { Tables } from "@/lib/supabase/database.types";
import { useGetGroupTomatoes } from "@/lib/tomatoService";
import { timestampSplit } from "@/lib/utils";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import {
    ArrowRight,
    Calendar,
    Loader2,
    Plus,
    Target,
    Users,
} from "lucide-react";

export const Route = createLazyFileRoute("/groups")({
    component: GroupsTabs,
});

const GroupsList = ({ groups }: { groups: Tables<"group">[] }) => {
    return groups.map((group) => (
        <li key={group.id}>
            {/* <Group group={group} /> */}
            <Component2 group={group} />
        </li>
    ));
};

const Groups = () => {
    const { session } = useAuth();
    const { data, isError, isLoading } = useGetUserGroups({
        user_id: session?.user.id,
    });

    const groups = data
        ? data
              .map((x) => (x.group ? x.group : undefined))
              .filter((group) => group != undefined)
        : undefined;

    if (isError) {
        return null;
    }

    return (
        <div className="px-6 md:px-12">
            <div className="flex justify-between items-center mb-12 flex-wrap gap-8">
                <h1 className="text-5xl font-semibold">Groups</h1>
                <div className="flex items-center gap-3">
                    <GroupCreateModal>
                        <Button
                            variant="outline"
                            size={"sm"}
                            className="text-muted-foreground"
                        >
                            <Plus className="size-3 mr-2" />
                            Create group
                        </Button>
                    </GroupCreateModal>
                    <span className="text-muted-foreground text-xs border-l pl-4">
                        {(groups || []).length}/{CONFIG.maxGroups}
                    </span>
                    <div className="text-muted-foreground text-xs border-l pl-2">
                        Time left today: 12:32
                    </div>
                </div>
            </div>
            {!isLoading && !isError && (
                <ul className=" w-full space-y-32 md:px-10 pb-10">
                    <GroupsList groups={groups || []} />
                </ul>
            )}
            {isLoading && !isError && (
                <div className="flex justify-center items-center animate-spin">
                    <Loader2 />
                </div>
            )}
            {isError && (
                <div className="px-10 py-10">
                    <DataError message="Failed to load groups" />
                </div>
            )}
        </div>
    );
};

function GroupsTabs() {
    return (
        <div className="flex flex-col mt-12">
            <Groups />
        </div>
    );
}

const GroupUserList = ({ groupID }: { groupID: string }) => {
    const { data: groupUsers, isLoading } = useGetGroupUsers({ groupID });

    if (isLoading) return <Skeleton className="w-full h-10" />;

    return (
        <ul className="flex -space-x-2">
            {groupUsers?.map((user) => {
                if (!user.profile) return null;
                return (
                    <li key={user.id}>
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger>
                                    <GroupUserAvatar
                                        className="border-2 border-gray-800 rounded-xl"
                                        groupUser={user}
                                        creatorBadge
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    {user.profile.username}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                );
            })}
        </ul>
    );
};

const TargetUserAvatar = ({ userID }: { userID: string }) => {
    const { data: userProfile } = useGetUserProfile({ user_id: userID });

    if (!userProfile) return null;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    <UserAvatar user={userProfile} />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {userProfile.username}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

function Component2({ group }: { group: Tables<"group"> }) {
    return (
        <Card
            // className="p-6 w-full  bg-gray-900 text-white border border-gray-800"
            className="p-4 md:p-6 w-full "
        >
            <div className="flex justify-between items-start mb-12 md:mb-6">
                <div className="flex-1 mr-4">
                    <h2 className="text-3xl font-bold mb-2 text-purple-800 dark:text-purple-300 break-words max-w-[12rem] md:max-w-full ">
                        {group.name}
                    </h2>
                    <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {timestampSplit(group.created_at).date}
                    </div>
                </div>
                <Link to={`/groups/$groupID`} params={{ groupID: group.id }}>
                    <Button
                        className="bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-500 group"
                        size={"sm"}
                    >
                        View{" "}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-all" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <GroupTasksProgress group={group} />
                <GroupTargetUsers groupID={group.id} />
            </div>
            <div className="border p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2 flex items-center ">
                    <Users className="w-4 h-4 mr-1 text-purple-400 " />
                    Group Members
                </div>
                <div className="flex -space-x-2 overflow-x-auto">
                    <GroupUserList groupID={group.id} />
                </div>
            </div>
        </Card>
    );
}

const GroupTargetUsers = ({ groupID }: { groupID: string }) => {
    const { data: groupTomatoes, isLoading } = useGetGroupTomatoes({ groupID });

    if (isLoading) return <Skeleton className="w-full h-20" />;

    return (
        <div className="border p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1 text-purple-400 " />
                Target Users
            </div>
            <div className="flex overflow-x-auto">
                <ul className="flex -space-x-2">
                    {groupTomatoes?.map((tomato) => {
                        if (!tomato.user_id) return null;
                        return (
                            <li key={tomato.user_id}>
                                <TargetUserAvatar userID={tomato.user_id} />
                            </li>
                        );
                    })}
                </ul>
                {!groupTomatoes ||
                    (groupTomatoes.length === 0 && (
                        <div className="text-sm text-gray-400">No targets.</div>
                    ))}
            </div>
        </div>
    );
};

const GroupTasksProgress = ({ group }: { group: Tables<"group"> }) => {
    const { session } = useAuth();
    const { data: groupUserTasks, isLoading } = useGetGroupUserTasks({
        groupID: group.id,
        userID: session?.user.id ?? "",
        enabled: !!session,
    });

    const completed =
        groupUserTasks?.filter((task) => task.task_completion.length > 0) || [];

    if (isLoading) return <Skeleton className="w-full h-20" />;

    const completedLength = completed?.length ?? 0;
    const totalTasks = groupUserTasks?.length ?? 0;

    return (
        <div className="border p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">Tasks Completed</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {completedLength}/{totalTasks}
            </div>
            <div className="py-4">
                <Progress value={(completedLength / totalTasks) * 100} />
            </div>
        </div>
    );
};
