import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useCreateTaskCompletion } from "@/lib/hooks/mutations/use-create-task-completion";
import { useDeleteTaskCompletion } from "@/lib/hooks/mutations/use-delete-task-completion";
import { useAuth } from "@/lib/hooks/use-auth";
import { TaskWithCompletion } from "@/lib/types";
import SpinnerButton from "@/spinner-button";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import GroupCreateTaskModal from "./group-create-task-modal";

export default function GroupYourTasksToday({
    tasks,
    groupID,
}: {
    tasks: TaskWithCompletion[];
    groupID: string;
}) {
    return (
        <Collapsible className="p-4 flex flex-col gap-2" defaultOpen={true}>
            <CollapsibleTrigger>
                <h3 className="text-4xl font-semibold text-center">
                    Your tasks for today
                </h3>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
                <ul className="flex flex-col gap-2">
                    <UserTasksTodayList tasks={tasks} />
                    {tasks.length == 0 && (
                        <div>You don't have any tasks at all.</div>
                    )}
                </ul>
                <div className="flex items-center justify-between mt-1 border px-3 py-1 rounded-lg bg-secondary/50 text-secondary-foreground ">
                    <span className="text-muted-foreground text-xs">
                        All : {tasks.length} Completed:{" "}
                        {
                            tasks.filter(
                                (task) => task.task_completion.length > 0
                            ).length
                        }
                    </span>
                    <GroupCreateTaskModal
                        groupID={groupID}
                        userTasksCount={tasks.length}
                    />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

const UserTasksTodayList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks
        .sort((a, b) => a.task_completion.length - b.task_completion.length)
        .map((task) => <UserTaskToday key={task.id} task={task} />);
};

const UserTaskToday = ({ task }: { task: TaskWithCompletion }) => {
    const { session } = useAuth();

    return (
        <div className="p-2 border flex justify-between px-8 rounded-lg">
            <div className="flex flex-col">
                <span className="text-xl">{task.name}</span>
            </div>
            {task.user_id == session?.user.id && (
                <UserTaskTodayCompletion task={task} />
            )}
        </div>
    );
};

const UserTaskTodayCompletion = ({ task }: { task: TaskWithCompletion }) => {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useCreateTaskCompletion();
    // const {
    //     data: taskCompletion,
    //     isError,
    //     isLoading,
    //     refetch,
    // } = useGetTaskCompletionToday({
    //     task_id: task.id,
    // });
    // const {
    //     data: taskCompletion,
    //     isError,
    //     isLoading,
    //     refetch,
    // } = useQuery({
    //     queryKey: ["completion", task.id],
    //     queryFn: async () => {
    //         const { data } = await supabase
    //             .from("task_completion")
    //             .select("*")
    //             .eq("task_id", task.id)
    //             .eq("date", new Date().toISOString().split("T")[0])
    //             .limit(1)
    //             .maybeSingle();
    //         return data;
    //     },
    // });

    const { mutateAsync: deleteTaskCompletion, isPending: isDeletePending } =
        useDeleteTaskCompletion();

    const onCompleteTask = async () => {
        await mutateAsync(
            [
                {
                    user_id: task.user_id,
                    group_id: task.group_id,
                    task_id: task.id,
                },
            ]
            // {
            //     onSuccess: () => {
            //         // queryClient.invalidateQueries({
            //         //     queryKey: ["completion", task.id],
            //         // });
            //     },
            // }
        );
        // refetch();
    };

    const onUndoCompletion = async () => {
        if (task.task_completion.length == 0) return;

        await deleteTaskCompletion(
            { ...task.task_completion[0] },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["task"],
                    });
                },
                onError: () => console.log("error"),
            }
        );

        // supabase.from("task_completion").delete().eq("id", taskCompletion.id);
        // console.log("done?")
        // refetch();
    };

    // if (isError) {
    //     return <DataError message="Couldn't get data." />;
    // }

    // if (isLoading) {
    //     return <Loading />;
    // }

    // console.log(task.name, taskCompletion);

    if (task.task_completion.length > 0) {
        return (
            <div className="flex items-center gap-4">
                <CheckIcon />
                <SpinnerButton
                    isPending={isDeletePending}
                    disabled={isDeletePending}
                    variant={"secondary"}
                    onClick={onUndoCompletion}
                >
                    Undo
                </SpinnerButton>
            </div>
        );
    }

    return (
        <SpinnerButton
            disabled={isPending}
            isPending={isPending}
            variant={"ghost"}
            onClick={onCompleteTask}
        >
            Complete
        </SpinnerButton>
    );
};
