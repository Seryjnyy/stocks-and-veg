import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteTask } from "@/hooks/supabase/group/use-delete-task";
import { useGetGroup } from "@/hooks/supabase/group/use-get-group";
import { useGetGroupUser } from "@/hooks/supabase/group/use-get-group-user";
import { TaskWithCompletion } from "@/lib/types";
import { timestampSplit } from "@/lib/utils";
import SpinnerButton from "@/components/spinner-button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Trash2 } from "lucide-react";
import GroupUserProfile from "../group-user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import DeleteTaskDialog from "./task-delete-dialog";
import UserTaskTodayCompletion from "./task-completion";
import TaskCompletion from "./task-completion";
import useWorkStatus from "@/hooks/use-work-status";

const TaskDetailDialog = ({
    task,
    groupInfo = false,
}: {
    task: TaskWithCompletion;
    groupInfo?: boolean;
}) => {
    const { session } = useAuth();
    const { mutateAsync: deleteTask, isPending } = useDeleteTask();
    const isWorkEnabled = useWorkStatus();

    const onDeleteTask = async () => {
        if (!isWorkEnabled) return;

        await deleteTask({ id: task.id });
    };

    const { data: group, isLoading: isGroupLoading } = useGetGroup({
        groupID: task.group_id,
    });

    const { data: user, isLoading: isUserLoading } = useGetGroupUser({
        groupID: task.group_id,
        userID: task.user_id,
    });

    const isOurTask = session?.user.id == task.user_id;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="text-muted-foreground"
                >
                    <EyeOpenIcon className="size-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="pb-12">
                    <DialogTitle className="break-words max-w-[10rem] sm:max-w-[24rem] md:max-w-[26rem] lg:max-w-[26rem]">
                        {task.name}
                    </DialogTitle>
                    <DialogDescription className="break-words max-w-[10rem] sm:max-w-[18rem] md:max-w-[22rem] lg:max-w-[26rem]">
                        {task.desc}
                    </DialogDescription>
                    {user && (
                        <div className="flex justify-center  w-fit">
                            <GroupUserProfile
                                groupUser={user}
                                avatarSize={"sm"}
                                usBadge
                                detailSize={"2xl"}
                                className="flex justify-start"
                            />
                        </div>
                    )}
                    {isUserLoading && (
                        <Skeleton className="w-[19rem] h-16 mx-auto" />
                    )}
                    <span className="flex items-center gap-2 text-xs text-muted-foreground px-2">
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
                <div className="flex justify-between items-start pb-2">
                    {isOurTask && (
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
                    )}
                    <div className="ml-auto">
                        <TaskCompletion
                            task={task}
                            undo
                            timeOfCompletion
                            complete
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailDialog;
