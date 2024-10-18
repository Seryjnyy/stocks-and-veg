import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import CreateTaskForm from "./create-task-form";
import { CONFIG } from "@/lib/config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";

export default function GroupCreateTaskModal({
    userTasksCount,
    children,
    groupUser,
}: {
    userTasksCount: number;
    children: React.ReactNode;
    groupUser: GroupUserWithProfile | undefined;
}) {
    const isTaskLimitReached = userTasksCount >= CONFIG.maxTasks;

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Create task</span>
                        <span className="text-muted-foreground text-xs">
                            {userTasksCount ?? 0}/{CONFIG.maxTasks}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Create a new task for yourself.
                    </DialogDescription>
                </DialogHeader>
                {isTaskLimitReached && (
                    <Alert variant="warning" className="mb-2">
                        <AlertTriangle className="size-4 mr-2" />
                        <span>
                            You have reached the maximum number of tasks.
                        </span>
                    </Alert>
                )}
                {groupUser && (
                    <CreateTaskForm
                        groupUser={groupUser}
                        disabled={isTaskLimitReached}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
