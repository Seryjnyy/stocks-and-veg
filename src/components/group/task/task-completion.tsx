import { useAuth } from "@/hooks/use-auth";
import { useCreateTaskCompletion } from "@/lib/hooks/mutations/use-create-task-completion";
import { useDeleteTaskCompletion } from "@/lib/hooks/mutations/use-delete-task-completion";
import { TaskWithCompletion } from "@/lib/types";
import { cn, timestampSplit } from "@/lib/utils";
import SpinnerButton from "@/spinner-button";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { useState } from "react";

const TaskCompletion = ({
    task,
    undo = false,
    timeOfCompletion = false,
    complete = false,
}: {
    task: TaskWithCompletion;
    undo?: boolean;
    complete?: boolean;
    timeOfCompletion?: boolean;
}) => {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useCreateTaskCompletion();
    const [animKey, setAnimKey] = useState(0);

    const { mutateAsync: deleteTaskCompletion, isPending: isDeletePending } =
        useDeleteTaskCompletion();
    const isOurTask = task.user_id == session?.user.id;

    const onCompleteTask = async () => {
        if (!isOurTask) return;

        setAnimKey((prev) => prev + 1);
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
        if (!isOurTask) return;
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
    };

    if (task.task_completion.length > 0) {
        return (
            <div className="relative">
                <div className="flex items-center gap-2">
                    <CheckIcon className="text-purple-400" />
                    {isOurTask && undo && (
                        <SpinnerButton
                            isPending={isDeletePending}
                            disabled={isDeletePending}
                            variant={"secondary"}
                            onClick={onUndoCompletion}
                            size={"sm"}
                        >
                            <Undo2 className="size-3 mr-2" />
                            Undo
                        </SpinnerButton>
                    )}
                </div>
                {timeOfCompletion && (
                    <span className=" text-xs text-muted-foreground/80 pt-1 px-2 right-0 absolute">
                        {
                            timestampSplit(task.task_completion[0].completed_at)
                                .time
                        }
                    </span>
                )}
            </div>
        );
    }

    if (!isOurTask) return <CheckIcon className="text-purple-400" />;

    if (complete) {
        return (
            <div className="relative">
                <SpinnerButton
                    disabled={isPending}
                    isPending={isPending}
                    variant={"outline"}
                    onClick={onCompleteTask}
                    size={"sm"}
                >
                    Complete
                </SpinnerButton>
                <div
                    key={animKey}
                    className={cn(
                        "h-[10rem] w-[10rem]   rounded-full absolute -z-10 -bottom-[3rem] left-0 opacity-80",
                        animKey > 0 &&
                            "animate-explosion bg-gradient-to-r from-purple-500 to-indigo-600"
                    )}
                ></div>
            </div>
        );
    }
    return null;
};

export default TaskCompletion;
