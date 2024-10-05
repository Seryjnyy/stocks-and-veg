import DataError from "@/components/data-error";
import CreateTask from "@/components/group/create-task";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useCreateTaskCompletion } from "@/lib/hooks/mutations/use-create-task-completion";
import { useDeleteTaskCompletion } from "@/lib/hooks/mutations/use-delete-task-completion";
import {
    TaskWithCompletion,
    useGetGroupTasks,
} from "@/lib/hooks/queries/use-get-group-tasks";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { Tables } from "@/lib/supabase/database.types";
import SpinnerButton from "@/spinner-button";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

export default function GroupTasks({ groupID }: { groupID: string }) {
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
        <>
            <div className="border p-4">
                <h3>Group tasks</h3>
                <ul>
                    <GroupTasksList tasks={tasks || []} />
                </ul>
                <span>{(tasks || []).length}</span>
                <CreateTask groupID={groupID} />
            </div>
            <UserTasksToday tasks={tasks || []} />
        </>
    );
}

const GroupTask = ({ task }: { task: Tables<"task"> }) => {
    // TODO : I feel like users should get fetched then use context instead of fetching everywhere
    const { data, isError, isLoading } = useGetUserProfile({
        user_id: task.user_id,
    });

    return (
        <li className="p-4 border">
            <div className="flex flex-col border p-2">
                <span>{task.name}</span>
                <span>{task.desc}</span>
                <span>{task.created_at}</span>
            </div>
            <div>
                {isLoading ?? <Loading />}
                {isError ?? <DataError message="Couldn't get user data." />}
                {data?.username}
            </div>
        </li>
    );
};

const GroupTasksList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks.map((task) => <GroupTask key={task.id} task={task} />);
};

const UserTaskToday = ({ task }: { task: TaskWithCompletion }) => {
    return (
        <div className="p-2 border flex justify-between fle">
            <div className="flex flex-col">
                <span>{task.name}</span>
                <span>{task.desc}</span>
                <span>{task.user_id}</span>
                <span>task id: {task.id}</span>
                <span>{task.group_id}</span>
            </div>
            <UserTaskTodayCompletion task={task} />
        </div>
    );
};

const UserTasksTodayList = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return tasks
        .sort((a, b) => a.task_completion.length - b.task_completion.length)
        .map((task) => <UserTaskToday key={task.id} task={task} />);
};

const UserTasksToday = ({ tasks }: { tasks: TaskWithCompletion[] }) => {
    return (
        <div className="p-4 border">
            <h3>Your tasks for today</h3>
            <ul>
                <UserTasksTodayList tasks={tasks} />
            </ul>
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
