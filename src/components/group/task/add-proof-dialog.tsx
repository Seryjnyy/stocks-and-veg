import ImageDropZone from "@/components/image-drop-zone";
import SpinnerButton from "@/components/spinner-button";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteProof } from "@/hooks/supabase/group/use-delete-proof";
import { useUpdateTaskCompletion } from "@/hooks/supabase/group/use-update-task-completion";
import { useUploadTaskCompletionProof } from "@/hooks/supabase/group/use-upload-task-completion-proof";
import { useToast } from "@/hooks/use-toast";
import { TaskWithCompletion } from "@/lib/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CameraIcon, PlusIcon, UploadIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";

export default function AddProofDialog({ task }: { task: TaskWithCompletion }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"sm"}>
                    <PlusIcon className="size-3 mr-1" />
                    <CameraIcon className="size-3 " />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add proof for:{" "}
                        <span className="text-muted-foreground">
                            {task.name}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Attach a picture to show you completed the task.
                    </DialogDescription>
                </DialogHeader>

                <SelectImage task={task} closeDialog={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

const SelectImage = ({
    task,
    closeDialog,
}: {
    task: TaskWithCompletion;
    closeDialog: () => void;
}) => {
    const [success, setSuccess] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const { mutateAsync: uploadProof, isPending: isUploadPending } =
        useUploadTaskCompletionProof({
            taskCompletionID:
                task.task_completion.length > 0
                    ? task.task_completion[0].id
                    : "error",
        });

    console.log(task.task_completion);
    const { toast } = useToast();
    const { mutateAsync: updateTaskCompletion, isPending: isUpdatePending } =
        useUpdateTaskCompletion();

    const { mutateAsync: deleteProof, isPending: isDeletePending } =
        useDeleteProof();

    const handleUploadProof = async () => {
        if (!image || task.task_completion.length <= 0) return;

        const res = await uploadProof({
            files: [image],
            path: `${task.group_id}`,
        });

        if (res.length >= 1) {
            const imgRes = res[0];

            if (imgRes.error) {
                // toast
                console.error(imgRes.error);
                toast({
                    title: "Error uploading proof",
                    description: "Please try again.",
                    variant: "destructive",
                });
                return;
            }

            // update task completion with image path
            // if that update fails, then I think it needs to delete the image
            updateTaskCompletion(
                {
                    id: task.task_completion[0].id,
                    proof_path: imgRes.data.path,
                },
                {
                    onSuccess: () => {
                        console.log("updated task completion");

                        toast({
                            title: "Successfully uploaded your proof.",
                        });

                        setSuccess(true);
                    },
                    onError: async () => {
                        // delete proof because couldn't update task completion table

                        // TODO : idk what to do if this fails
                        deleteProof([imgRes.data.path]);

                        toast({
                            title: "Error uploading proof",
                            description: "Please try again.",
                            variant: "destructive",
                        });

                        // Just in case
                        setSuccess(false);
                    },
                }
            );
        } else {
            console.error("This shouldn't happen I think.");
        }
    };

    return (
        <>
            {!image && (
                <div>
                    <ImageDropZone
                        onFileDrop={(images) => {
                            if (images.length > 0) {
                                setImage(images[0]);
                            }
                        }}
                    />
                    <div className="flex gap-3 text-xs text-muted-foreground pt-1">
                        <span>Images only</span>
                        <span>5MB Max</span>
                    </div>
                </div>
            )}
            {image && (
                <>
                    <div className="w-full flex flex-col gap-2">
                        <img
                            src={URL.createObjectURL(image)}
                            className="max-h-[15rem] mx-auto p-1 border rounded-md"
                        />
                    </div>
                </>
            )}
            {!success && (
                <div className="flex justify-between">
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => setImage(null)}
                        disabled={!image}
                    >
                        <ReloadIcon className="size-3 mr-2" /> Restart
                    </Button>

                    <SpinnerButton
                        variant={"default"}
                        size={"sm"}
                        isPending={
                            isUploadPending ||
                            isUpdatePending ||
                            isDeletePending
                        }
                        disabled={
                            !image ||
                            isUploadPending ||
                            isUpdatePending ||
                            isDeletePending
                        }
                        onClick={handleUploadProof}
                    >
                        <UploadIcon className="size-3 mr-2" /> Upload
                    </SpinnerButton>
                </div>
            )}
            {success && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs">
                        Success! Your proof was uploaded.
                    </span>
                    <Button
                        size={"sm"}
                        variant={"secondary"}
                        onClick={closeDialog}
                    >
                        Close
                    </Button>
                </div>
            )}
        </>
    );
};
