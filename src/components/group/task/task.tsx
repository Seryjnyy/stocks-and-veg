import { TaskWithCompletion } from "@/lib/types";
import TaskCompletion from "./task-completion";
import TaskDetailDialog from "./task-detail-dialog";

const Task = ({
    task,
    complete = false,
}: {
    task: TaskWithCompletion;
    complete?: boolean;
}) => {
    return (
        <div className="py-2 border flex justify-between pl-2 pr-1 sm:pl-8 rounded-lg items-center">
            <h3 className="text-sm sm:text-md md:text-xl truncate max-w-[10rem] md:max-w-[16rem] lg:max-w-[20rem] xl:max-w-[24rem]">
                {task.name}
            </h3>

            <div className="flex items-center justify-end ">
                <TaskCompletion task={task} complete={complete} />
                <TaskDetailDialog task={task} />
            </div>
        </div>
    );
};

export default Task;
