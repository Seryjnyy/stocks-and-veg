import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { useGetGroupTasks } from "@/lib/hooks/queries/use-get-group-tasks";
import { useGetGroupUsers } from "@/lib/hooks/queries/use-get-group-users";
import { TaskWithCompletion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import GroupUserProfile from "./group-user-profile";

export default function GroupOtherUsersTasks({ groupID }: { groupID: string }) {
    const {
        data: tasks,
        isError,
        isLoading,
    } = useGetGroupTasks({ groupID: groupID });

    if (isError) {
        return <DataError message="Couldn't fetch group tasks." />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (tasks == null) {
        return <DataError message="Group tasks data is missing." />;
    }

    return (
        <div>
            <ul className="space-y-16">
                <GroupTasksList tasks={tasks || []} />
            </ul>
        </div>
    );
}

const GroupTask = ({ task }: { task: TaskWithCompletion }) => {
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

    // const className = "bg-purple-950/30";
    const className = "";

    return (
        <li
            className={cn(
                "p-2 border flex justify-between px-8 rounded-lg w-full",
                className
            )}
        >
            <span className="text-xl ">{task.name}</span>
            <div className="flex items-center">
                {task.task_completion.length > 0 && <CheckIcon />}
            </div>
        </li>
    );
};

const Grouped = ({
    userTasks,
}: {
    userTasks: { userID: string; tasks: TaskWithCompletion[] };
}) => {
    // TODO : Idk if this is a good approach, the group page should get group_users with profile data, and use that everywhere

    const groupID =
        userTasks.tasks.length > 0 ? userTasks.tasks[0].group_id : undefined;

    const { data, isError, isLoading } = useGetGroupUsers({
        groupID: groupID,
    });

    if (isLoading) return null;

    if (isError) return null;

    const user = data?.find(
        (groupUser) => groupUser.user_id == userTasks.userID
    );

    if (!user) return null;

    return (
        <div>
            <div
                className="flex justify-between items-center"
                id={`${userTasks.userID}-tasks`}
            >
                <GroupUserProfile groupUser={user} className="border-none" />
                <span className="text-xs text-muted-foreground">
                    {
                        userTasks.tasks.filter(
                            (task) => task.task_completion.length > 0
                        ).length
                    }
                    /{userTasks.tasks.length}
                </span>
            </div>
            <ul className="flex flex-col gap-2 pl-12">
                {userTasks.tasks
                    .sort(
                        (a, b) =>
                            (a.task_completion.length > 0 ? 1 : -1) -
                            (b.task_completion.length > 0 ? 1 : -1)
                    )
                    .map((task) => (
                        <GroupTask key={task.id} task={task} />
                    ))}
            </ul>
            {userTasks.tasks.length == 0 && <div>No tasks.</div>}
        </div>
    );
};

const GroupTasksList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    const groupedByUserID = tasks.reduce(
        (grouped, task) => {
            const { user_id } = task;
            if (!grouped[user_id]) {
                grouped[user_id] = [];
            }

            grouped[user_id].push(task);
            return grouped;
        },
        {} as Record<string, TaskWithCompletion[]>
    );

    return Object.entries(groupedByUserID)
        .map(([userID, tasks]) => ({ userID: userID, tasks: tasks }))
        .map((userTasks, index) => (
            <Grouped key={index} userTasks={userTasks} />
        ));
};
