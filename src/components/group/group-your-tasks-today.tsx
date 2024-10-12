import { useAuth } from "@/hooks/use-auth";
import { useCreateTaskCompletion } from "@/lib/hooks/mutations/use-create-task-completion";
import { useDeleteTaskCompletion } from "@/lib/hooks/mutations/use-delete-task-completion";
import { useGetGroupTasks } from "@/lib/hooks/queries/use-get-group-tasks";
import { TaskWithCompletion } from "@/lib/types";
import SpinnerButton from "@/spinner-button";
import { CheckIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import GroupCreateTaskModal from "./group-create-task-modal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { timestampSplit } from "@/lib/utils";
import { ArrowRight, Calendar, Trash2 } from "lucide-react";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "../ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteTask } from "@/lib/hooks/mutations/use-delete-task";
import { useState } from "react";

// TODO : loading and error
export default function GroupYourTasksToday({ groupID }: { groupID: string }) {
    const {
        data: tasks,
        isError,
        isLoading,
    } = useGetGroupTasks({ groupID: groupID });
    const { session } = useAuth();

    const userTasks =
        (tasks && tasks.filter((task) => task.user_id == session?.user.id)) ||
        [];

    return (
        <div>
            <ul className="flex flex-col gap-2">
                <ul>
                    <UserTasksTodayList tasks={userTasks} />
                </ul>
                {userTasks.length == 0 && (
                    <div>You don't have any tasks at all.</div>
                )}
            </ul>
            <footer className="flex items-center justify-between mt-1 border px-3 py-1 rounded-lg bg-secondary/50 text-secondary-foreground ">
                <span className="text-muted-foreground text-xs">
                    All : {userTasks.length} Completed:{" "}
                    {
                        userTasks.filter(
                            (task) => task.task_completion.length > 0
                        ).length
                    }
                </span>
                <GroupCreateTaskModal
                    groupID={groupID}
                    userTasksCount={userTasks.length}
                >
                    <Button size={"sm"} variant={"outline"}>
                        Add task
                    </Button>
                </GroupCreateTaskModal>
            </footer>
        </div>
    );
}

const UserTasksTodayList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks
        .sort((a, b) => a.task_completion.length - b.task_completion.length)
        .map((task) => (
            <li key={task.id}>
                <UserTaskToday task={task} />
            </li>
        ));
};

const DeleteTaskDialog = ({
    children,
    onDeleteTask,
}: {
    children: React.ReactNode;
    onDeleteTask: () => void;
}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your task.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDeleteTask}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const TaskViewMoreModal = ({
    task,
    groupInfo = false,
}: {
    task: TaskWithCompletion;
    groupInfo?: boolean;
}) => {
    const { session } = useAuth();
    const { mutateAsync: deleteTask, isPending } = useDeleteTask();

    const onDeleteTask = async () => {
        await deleteTask({ id: task.id });
    };

    const { data: group, isLoading: isGroupLoading } = useGetGroup({
        groupID: task.group_id,
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="text-muted-foreground"
                >
                    <EyeOpenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <span className="text-muted-foreground">Task: </span>
                        {task.name}
                    </DialogTitle>
                    <DialogDescription>{task.desc}</DialogDescription>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        {timestampSplit(task.created_at).date}
                    </span>
                </DialogHeader>

                {groupInfo && (
                    <div className="flex flex-col">
                        {!group && isGroupLoading && (
                            <Skeleton className="w-[16rem] h-5" />
                        )}

                        {group && (
                            <div className="py-2 flex items-center justify-between">
                                <span>
                                    <span className="text-muted-foreground">
                                        Group:
                                    </span>
                                    <span className="ml-2">
                                        {group && group.name}
                                    </span>
                                </span>
                                <Link
                                    to="/groups/$groupID"
                                    params={{ groupID: group?.id || "" }}
                                >
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        className="group"
                                    >
                                        View group{" "}
                                        <ArrowRight className="size-3 ml-2 group-hover:translate-x-1 transition-all" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <DeleteTaskDialog onDeleteTask={onDeleteTask}>
                        <SpinnerButton
                            isPending={isPending}
                            disabled={isPending}
                            variant={"destructive"}
                            size={"sm"}
                        >
                            <Trash2 className="size-3 mr-2" /> Delete task
                        </SpinnerButton>
                    </DeleteTaskDialog>
                    {task.user_id == session?.user.id && (
                        <UserTaskTodayCompletion task={task} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const UserTaskToday = ({ task }: { task: TaskWithCompletion }) => {
    const { session } = useAuth();

    return (
        <div className="p-2 border flex justify-between px-8 rounded-lg">
            <div className="flex flex-col">
                <h3 className="text-xl">{task.name}</h3>
            </div>
            <div className="flex items-center gap-3">
                {task.user_id == session?.user.id && (
                    <UserTaskTodayCompletion task={task} />
                )}
                <TaskViewMoreModal task={task} />
            </div>
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
