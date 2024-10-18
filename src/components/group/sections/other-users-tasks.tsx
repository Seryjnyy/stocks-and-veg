import DataError from "@/components/data-error";
import Loading from "@/components/loading";
import { useGetGroupTasks } from "@/lib/hooks/queries/use-get-group-tasks";
import { useGetGroupUsers } from "@/lib/hooks/queries/use-get-group-users";
import { TaskWithCompletion } from "@/lib/types";
import GroupUserProfile from "../group-user-profile";
import Task from "../task/task";

export default function OtherUsersTasks({ groupID }: { groupID: string }) {
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
                <GroupedTasksList tasks={tasks || []} />
            </ul>
        </div>
    );
}

const GroupedTasksList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
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

    const completedTasks = userTasks.tasks.filter(
        (task) => task.task_completion.length > 0
    );

    const uncompletedTasks = userTasks.tasks.filter(
        (task) => task.task_completion.length == 0
    );

    return (
        <div>
            <div
                className="flex justify-between items-center"
                id={`${userTasks.userID}-tasks`}
            >
                <GroupUserProfile
                    groupUser={user}
                    variant={"dashed"}
                    viewMore
                    usBadge
                    creatorBadge
                    detailSize={"responsive"}
                />
                <span className="text-xs text-muted-foreground">
                    {completedTasks.length}/{userTasks.tasks.length}
                </span>
            </div>
            <ul className="flex flex-col gap-2 ml-6 pl-6 mt-1 border-l">
                <li>
                    {uncompletedTasks.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            Uncompleted
                        </span>
                    )}
                    <ul className="flex flex-col gap-2">
                        <TaskList tasks={uncompletedTasks} />
                    </ul>
                </li>
                <li>
                    {completedTasks.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            Completed
                        </span>
                    )}
                    <ul className="flex flex-col gap-2">
                        <TaskList tasks={completedTasks} />
                    </ul>
                </li>
            </ul>
            {userTasks.tasks.length == 0 && <div>No tasks.</div>}
        </div>
    );
};

const TaskList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks.map((task) => <Task key={task.id} task={task} />);
};
