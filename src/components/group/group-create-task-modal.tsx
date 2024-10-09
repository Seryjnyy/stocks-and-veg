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
}: {
    groupID: string;
    userTasksCount: number;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} variant={"outline"}>
                    Add task
                </Button>
            </DialogTrigger>
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
