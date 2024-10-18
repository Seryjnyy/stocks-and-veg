import { useAuth } from "@/hooks/use-auth";
import { useGetGroupTasks } from "@/lib/hooks/queries/use-get-group-tasks";
import { TaskWithCompletion } from "@/lib/types";
import { Plus } from "lucide-react";
import DataError from "../data-error";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import GroupCreateTaskModal from "./group-create-task-modal";
import Task from "./task/task";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";

export default function GroupYourTasksToday({ groupID }: { groupID: string }) {
    const { session } = useAuth();
    const {
        data: tasks,
        isError,
        isLoading,
    } = useGetGroupTasks({ groupID: groupID });

    const {
        data: groupUser,
        isError: isGroupUserError,
        isLoading: isGroupUserLoading,
    } = useGetGroupUser({
        groupID: groupID,
        userID: session?.user.id,
    });

    const userTasks =
        (tasks && tasks.filter((task) => task.user_id == session?.user.id)) ||
        [];

    const completedTasks = userTasks.filter(
        (task) => task.task_completion.length > 0
    );

    const uncompletedTasks = userTasks.filter(
        (task) => task.task_completion.length == 0
    );

    return (
        <>
            <span className="absolute top-8 right-1 text-xs text-muted-foreground">
                {completedTasks.length}/{userTasks.length}
            </span>
            <div>
                <ul className="flex flex-col gap-2">
                    {isLoading && <Skeleton className="w-full h-12" />}

                    <li>
                        {uncompletedTasks.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                                Uncompleted
                            </span>
                        )}
                        <ul className="flex flex-col gap-2">
                            <UserTasksTodayList tasks={uncompletedTasks} />
                        </ul>
                    </li>
                    <li>
                        {completedTasks.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                                Completed
                            </span>
                        )}
                        <ul className="flex flex-col gap-2">
                            <UserTasksTodayList tasks={completedTasks} />
                        </ul>
                    </li>

                    {isError && (
                        <DataError message="Sorry, something has gone wrong." />
                    )}
                    {userTasks.length == 0 && (
                        <li className="w-full flex justify-center text-muted-foreground py-3 border rounded-xl">
                            You don't have any tasks. Create some.
                        </li>
                    )}
                </ul>
                <footer className="flex items-center justify-between mt-2 border px-3 py-1 rounded-lg bg-secondary/50 text-secondary-foreground ">
                    <span className="text-muted-foreground text-xs">
                        All : {userTasks.length} | Completed:{" "}
                        {completedTasks.length}
                    </span>
                    <GroupCreateTaskModal
                        groupUser={groupUser ?? undefined}
                        userTasksCount={userTasks.length}
                    >
                        <Button
                            size={"sm"}
                            variant={"outline"}
                            disabled={
                                isGroupUserLoading ||
                                isGroupUserError ||
                                !groupUser
                            }
                        >
                            <Plus className="size-3 mr-2" /> Add task
                        </Button>
                    </GroupCreateTaskModal>
                </footer>
            </div>
        </>
    );
}

const UserTasksTodayList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks
        .sort((a, b) => a.task_completion.length - b.task_completion.length)
        .map((task) => (
            <li key={task.id}>
                <Task task={task} complete />
            </li>
        ));
};
