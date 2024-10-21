import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CameraIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskWithCompletion } from "@/lib/types";
import { useGetProof } from "@/hooks/supabase/group/use-get-proof";
import { Skeleton } from "@/components/ui/skeleton";
import DataError from "@/components/data-error";
import SpinnerButton from "@/components/spinner-button";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteProof } from "@/hooks/supabase/group/use-delete-proof";
import { useToast } from "@/hooks/use-toast";
import { useUpdateTaskCompletion } from "@/hooks/supabase/group/use-update-task-completion";

export default function ViewProofDialog({
    task,
}: {
    task: TaskWithCompletion;
}) {
    const { session } = useAuth();
    const isCreator = session && session.user.id == task.user_id;

    const path =
        task.task_completion.length > 0
            ? task.task_completion[0].proof_path
            : null;
    const {
        data: proofUrl,
        isError,
        isLoading,
    } = useGetProof({ proofPath: path ?? undefined, enabled: !!path });

    const { mutateAsync: deleteProof, isPending } = useDeleteProof();
    const {
        mutateAsync: updateTaskCompletion,
        isPending: isUpdatingTaskCompletion,
    } = useUpdateTaskCompletion();
    const { toast } = useToast();

    const handleDeleteProof = async () => {
        if (
            !isCreator ||
            task.task_completion.length <= 0 ||
            !task.task_completion[0].proof_path ||
            isPending
        )
            return;

        await deleteProof([task.task_completion[0].proof_path], {
            onSuccess: () => {
                toast({
                    title: "Successfully deleted proof.",
                });

                if (task.task_completion.length > 0) {
                    // TODO : proof might be deleted but then this might not be, and task completion will be in a wrong state
                    // TODO : need a transaction for this (supabase rpc) (might need to use custom chache update)
                    updateTaskCompletion({
                        id: task.task_completion[0].id,
                        proof_path: null,
                    });
                }
            },
            onError: () => {
                toast({
                    title: "Error deleting proof.",
                    description: "Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} variant={"outline"}>
                    <CameraIcon className="size-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Proof for:{" "}
                        <span className="text-muted-foreground">
                            {task.name}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        The image proof that this task was completed by the
                        user.
                    </DialogDescription>
                </DialogHeader>
                {isLoading && <Skeleton className="w-full h-[13rem]" />}
                {isError && <DataError message="Couldn't fetch proof." />}
                {proofUrl && (
                    <img
                        src={proofUrl}
                        alt="Proof"
                        className="w-full rounded-md"
                    />
                )}
                <DialogFooter>
                    {session && isCreator && proofUrl && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <SpinnerButton
                                    isPending={isPending}
                                    size={"sm"}
                                    variant={"destructive"}
                                >
                                    <Trash2 className="size-3 mr-2" /> Delete
                                </SpinnerButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the proof from the
                                        server.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteProof}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
