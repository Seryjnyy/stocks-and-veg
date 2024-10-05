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
import {
    GroupUserWithProfile,
    useGetGroupUsers,
} from "@/lib/hooks/queries/use-get-group-users";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { useAuth } from "@/lib/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import SpinnerButton from "@/spinner-button";
import { CheckIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useNavigate } from "@tanstack/react-router";

const GroupUserProfile = ({
    groupUser,
}: {
    groupUser: GroupUserWithProfile;
}) => {
    const { session } = useAuth();
    const { data, isLoading } = useGetGroup({
        groupID: groupUser.group_id,
        enabled: !!session,
    });
    const navigate = useNavigate();

    const isUserCreator = session
        ? data?.creator_id == session?.user.id
        : false;

    const handleRemoveUser = () => {
        console.error("Not implemented");
    };

    // TODO : Check if can be tomated, check if not us
    const isAbleToBeTomatoed = true;

    return (
        <div className="flex items-center gap-4 border p-3">
            <div className="w-4 h-4 bg-red-500"></div>
            <div>{groupUser.profile?.username}</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"sm"}>
                        <EyeOpenIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="sr-only">
                            Group user
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            View some more details about this user.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="border p-2 flex items-end gap-4 flex-wrap">
                        <div className="w-4 h-4 bg-red-500"></div>
                        <div>
                            <div>{groupUser.profile?.username}</div>
                            <div>joined at {groupUser.created_at}</div>
                        </div>
                        {isUserCreator && (
                            <SpinnerButton
                                size={"sm"}
                                variant={"destructive"}
                                isPending={isLoading}
                                disabled={isLoading}
                                onClick={handleRemoveUser}
                            >
                                Remove user
                            </SpinnerButton>
                        )}
                    </div>

                    <div>More stats</div>
                    <div>Total tasks</div>
                    <div>Completed tasks today</div>
                    <div>Not completed tasks today</div>
                    <div>Tomates count</div>
                    <div>level</div>
                    <div>days completed</div>
                    <div>days paritally completed (more than 50%) </div>
                    <div>times tomatoed</div>
                    <div>biggest tomatoed count</div>
                    <DialogFooter>
                        <Button
                            className="w-full"
                            disabled={!isAbleToBeTomatoed}
                            onClick={() => {
                                if (!isAbleToBeTomatoed) return;
                                navigate({
                                    to: "/groups/$groupID/tomato/$userID",
                                    params: {
                                        groupID: groupUser.group_id,
                                        userID: groupUser.user_id,
                                    },
                                });
                            }}
                        >
                            Tomatoe them
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

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

    const userTasks = tasks.filter((task) => task.user_id == session?.user.id);

    return (
        <>
            <div className="border p-4">
                <h3>Group tasks</h3>
                <ul>
                    <GroupTasksList tasks={tasks || []} />
                </ul>
                <span>{(tasks || []).length}</span>
                <div className="border p-2">
                    <CreateTask
                        groupID={groupID}
                        userTasksCount={userTasks.length}
                    />
                </div>
            </div>
            <UserTasksToday tasks={userTasks} />
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

    return (
        <li className="p-4 border">
            <div className="flex flex-col border p-2">
                <span>{task.name}</span>
                <span>{task.desc}</span>
                <span>{task.created_at}</span>
            </div>
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

const UserTaskToday = ({ task }: { task: TaskWithCompletion }) => {
    const { session } = useAuth();

    return (
        <div className="p-2 border flex justify-between fle">
            <div className="flex flex-col">
                <span>{task.name}</span>
                <span>{task.desc}</span>
                <span>user id: {task.user_id}</span>
                <span>task id: {task.id}</span>
                <span>group id: {task.group_id}</span>
            </div>
            {task.user_id == session?.user.id && (
                <UserTaskTodayCompletion task={task} />
            )}
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
                {tasks.length == 0 && (
                    <div>You don't have any tasks at all.</div>
                )}
            </ul>
            <div>
                <span className="text-muted-foreground">
                    All : {tasks.length} Completed:{" "}
                    {
                        tasks.filter((task) => task.task_completion.length > 0)
                            .length
                    }
                </span>
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
