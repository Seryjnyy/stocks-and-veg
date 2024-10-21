import { useGetGroupUser } from "@/hooks/supabase/group/use-get-group-user";
import { useGetUserGroupTasks } from "@/hooks/supabase/group/use-get-user-group-tasks";
import { useAuth } from "@/hooks/use-auth";
import { TaskWithCompletion } from "@/lib/types";
import { Plus } from "lucide-react";
import DataError from "../../data-error";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import GroupCreateTaskDialog from "../task/create-task-dialog";
import Task from "../task/task";

export default function YourTasksToday({ groupID }: { groupID: string }) {
    const { session } = useAuth();
    const {
        data: userTasks,
        isError,
        isLoading,
    } = useGetUserGroupTasks({
        groupID: groupID,
        userID: session?.user.id,
        enabled: !!session,
    });

    const {
        data: groupUser,
        isError: isGroupUserError,
        isLoading: isGroupUserLoading,
    } = useGetGroupUser({
        groupID: groupID,
        userID: session?.user.id,
    });

    const completedTasks =
        userTasks?.filter((task) => task.task_completion.length > 0) || [];

    const uncompletedTasks =
        userTasks?.filter((task) => task.task_completion.length == 0) || [];

    return (
        <>
            <div>
                <ul className="flex flex-col gap-2">
                    {isLoading && <Skeleton className="w-full h-12" />}

                    <li>
                        {uncompletedTasks.length > 0 && (
                            <div className="flex justify-between items-center px-1 pb-1 text-xs text-muted-foreground">
                                <span>Uncompleted</span>
                                <span>{uncompletedTasks.length}</span>
                            </div>
                        )}
                        <ul className="flex flex-col gap-2">
                            <TaskList tasks={uncompletedTasks} />
                        </ul>
                    </li>
                    <li>
                        {completedTasks.length > 0 && (
                            <div className="flex justify-between items-center px-1 pb-1 text-xs text-muted-foreground">
                                <span className="text-xs text-muted-foreground">
                                    Completed
                                </span>
                                <span>{completedTasks.length}</span>
                            </div>
                        )}
                        <ul className="flex flex-col gap-2">
                            <TaskList tasks={completedTasks} />
                        </ul>
                    </li>

                    {isError && (
                        <DataError message="Sorry, something has gone wrong." />
                    )}
                    {(userTasks || []).length == 0 && (
                        <li className="w-full flex justify-center text-muted-foreground py-3 border rounded-xl">
                            You don't have any tasks. Create some.
                        </li>
                    )}
                </ul>
                <footer className="flex items-center justify-between mt-2 border px-3 py-1 rounded-lg bg-secondary/50 text-secondary-foreground ">
                    <span className="text-muted-foreground text-xs">
                        All : {(userTasks || []).length} | Completed:{" "}
                        {completedTasks.length}
                    </span>
                    <GroupCreateTaskDialog
                        groupUser={groupUser ?? undefined}
                        userTasksCount={(userTasks || []).length}
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
                    </GroupCreateTaskDialog>
                </footer>
            </div>
        </>
    );
}

const TaskList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks
        .sort((a, b) => a.task_completion.length - b.task_completion.length)
        .map((task) => (
            <li key={task.id}>
                <Task task={task} complete />
            </li>
        ));
};
