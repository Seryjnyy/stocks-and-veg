import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { useGetGroupTasks } from "@/lib/hooks/queries/use-get-group-tasks";
import { useGetGroupUsers } from "@/lib/hooks/queries/use-get-group-users";
import { useAuth } from "@/lib/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import { TaskWithCompletion } from "@/lib/types";
import { cn } from "@/lib/utils";
import GroupUserProfile from "./group-user-profile";
import GroupYourTasksToday from "./group-your-tasks-today";

export default function GroupTasks({ groupID }: { groupID: string }) {
    const {
        data: tasks,
        isError,
        isLoading,
    } = useGetGroupTasks({ groupID: groupID });
    const { session } = useAuth();

    if (isError) {
        return <DataError message="Couldn't fetch group tasks." />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (tasks == null) {
        return <DataError message="Group tasks data is missing." />;
    }

    const userTasks =
        tasks.filter((task) => task.user_id == session?.user.id) || [];

    return (
        <>
            <GroupYourTasksToday tasks={userTasks} groupID={groupID} />

            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-3xl font-semibold text-center">
                    Group tasks
                </h3>
                <ul className="space-y-4">
                    <GroupTasksList tasks={tasks || []} />
                </ul>
                <span>{(tasks || []).length}</span>
            </div>
        </>
    );
}

const GroupTask = ({ task }: { task: Tables<"task"> }) => {
    // const { data, isError, isLoading } = useGetUserProfile({
    //     user_id: task.user_id,
    // });

    // TODO : Idk if this is a good approach, the group page should get group_users with profile data, and use that everywhere
    const { data, isError, isLoading } = useGetGroupUsers({
        groupID: task.group_id,
    });

    if (isLoading) return null;

    if (isError) return null;

    const user = data?.find((groupUser) => groupUser.user_id == task.user_id);

    if (!user) return null;

    const className = "";

    return (
        <li
            className={cn(
                "px-6 py-2 border flex items-center justify-between",
                className
            )}
        >
            <span className="text-2xl font-semibold">{task.name}</span>
            <div>
                {!isLoading && !isError && user && (
                    <GroupUserProfile groupUser={user} />
                )}
            </div>
        </li>
    );
};

const GroupTasksList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks.map((task) => <GroupTask key={task.id} task={task} />);
};
