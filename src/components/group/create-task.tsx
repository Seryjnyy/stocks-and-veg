import React from "react";
import CreateTaskForm from "./create-task-form";

export default function CreateTask({ groupID }: { groupID: string }) {
    return (
        <div>
            <h3>Create task</h3>
            <CreateTaskForm groupID={groupID} />
        </div>
    );
}
