import React from "react";
import CreateTaskForm from "./create-task-form";

export default function CreateTask({
    groupID,
    userTasksCount,
}: {
    groupID: string;
    userTasksCount: number;
}) {
    return (
        <div>
            <h3>Create task</h3>
            <CreateTaskForm groupID={groupID} userTasksCount={userTasksCount} />
        </div>
    );
}
