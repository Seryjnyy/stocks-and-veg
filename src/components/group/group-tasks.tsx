import DataError from "@/components/data-error";
import CreateTask from "@/components/group/create-task";
import Loading from "@/components/loading";
import { useCreateTaskCompletion } from "@/lib/hooks/mutations/use-create-task-completion";
import { useDeleteTaskCompletion } from "@/lib/hooks/mutations/use-delete-task-completion";
import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { useGetGroupTasks } from "@/lib/hooks/queries/use-get-group-tasks";
import {
    GroupUserWithProfile,
    useGetGroupUsers,
} from "@/lib/hooks/queries/use-get-group-users";
import { useAuth } from "@/lib/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import SpinnerButton from "@/spinner-button";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { CrownIcon, User2 } from "lucide-react";
import { Badge } from "../ui/badge";
import GroupUserDialog from "./group-user-dialog";
import { TaskWithCompletion } from "@/lib/types";
import { cn } from "@/lib/utils";

const GroupUserProfile = ({
    groupUser,
}: {
    groupUser: GroupUserWithProfile;
}) => {
    const { session } = useAuth();
    const { data } = useGetGroup({ groupID: groupUser.group_id });

    function hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash); // hash * 31 + charCode
        }
        return hash;
    }

    function stringToRGB(str: string): string {
        // Generate a hash from the string
        const hash = hashString(str);

        // Extract RGB values from the hash
        const r = (hash >> 16) & 0xff;
        const g = (hash >> 8) & 0xff;
        const b = hash & 0xff;

        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    const isUs = session?.user.id == groupUser.user_id;

    const isCreator = data && data.creator_id == groupUser.user_id;

    return (
        <div className="flex items-center gap-4 border p-3 border-dashed w-fit rounded-lg">
            <div
                className="w-8 h-8 rounded-md relative"
                style={{
                    // backgroundColor: stringToRGB(groupUser.user_id)
                    backgroundImage: `linear-gradient(to top, ${stringToRGB(groupUser.user_id)}, ${stringToRGB(groupUser.id)})`,
                }}
            >
                {isUs ? (
                    <Badge className="px-1 -bottom-1 absolute -left-2 opacity-80">
                        <User2 className="size-3" />
                    </Badge>
                ) : null}

                {isCreator ? (
                    <Badge className="px-1 -bottom-1 absolute -right-2 opacity-80">
                        <CrownIcon className="size-3" />
                    </Badge>
                ) : null}
            </div>
            <div>
                <div>{groupUser.profile?.username}</div>
                <div className="text-xs text-muted-foreground">
                    {groupUser.user_id}
                </div>
            </div>
            <div className="border-l pl-2">
                <GroupUserDialog groupUser={groupUser} />
            </div>
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
                <ul className="space-y-4">
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

    const className = "";

    return (
        <li className={cn("p-8 border", className)}>
            <div className="flex flex-col  p-2">
                <div className="flex flex-col pb-8">
                    <span className="text-2xl font-semibold">{task.name}</span>
                    <span className="text-muted-foreground">{task.desc}</span>
                </div>
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
        <div className="p-2 border flex justify-between ">
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
