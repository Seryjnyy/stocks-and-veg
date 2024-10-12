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

export default function GroupCreateTaskModal({
    groupID,
    userTasksCount,
    children,
}: {
    groupID: string;
    userTasksCount: number;
    children: React.ReactNode;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new task</DialogTitle>
                    <DialogDescription>
                        Create a new task for yourself.
                    </DialogDescription>
                </DialogHeader>
                <CreateTaskForm
                    groupID={groupID}
                    userTasksCount={userTasksCount}
                />
            </DialogContent>
        </Dialog>
    );
}
