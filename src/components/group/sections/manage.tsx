import { useToast } from "@/hooks/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

import { Tables } from "@/lib/supabase/database.types";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import TypeToConfirmAlertDialog from "@/components/type-to-confirm-alert-dialog";
import useWorkStatus from "@/hooks/use-work-status";
import { useDeleteGroup } from "@/hooks/supabase/groups/use-delete-group";

export default function Manage({ group }: { group: Tables<"group"> }) {
    const isWorkEnabled = useWorkStatus();
    const { mutateAsync: deleteGroup } = useDeleteGroup();

    const { toast } = useToast();
    const navigate = useNavigate();

    const handleDeleteGroup = async () => {
        await deleteGroup(
            { id: group.id },
            {
                onSuccess: () => {
                    // TODO : both of these don't work
                    toast({
                        title: "Successfully deleted group.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Failed to delete group.",
                        variant: "destructive",
                    });
                },
            }
        );

        navigate({
            to: "/groups",
        });
    };

    const handleResetTasks = async () => {
        if (!isWorkEnabled) return;

        console.error("Not implemented.");
    };

    const handleResetStats = async () => {
        if (!isWorkEnabled) return;

        console.error("Not implemented.");
    };

    return (
        <div className="flex flex-col gap-4">
            <TypeToConfirmAlertDialog
                title="Are you sure you want to delete this group?"
                description="This action cannot be undone. This will permanently delete this group along with all associated data."
                onConfirm={handleDeleteGroup}
                confirmText={group.name}
                buttonContent={
                    <>
                        <Trash2 className="size-3 mr-2" /> Delete group
                    </>
                }
            />

            <TypeToConfirmAlertDialog
                title="Are you sure you want to reset stats?"
                description="This action cannot be undone. This will permanently delete all stats. Meaning a fresh start. Tasks will remain."
                onConfirm={handleResetStats}
                confirmText={group.name}
                buttonContent={
                    <>
                        <ReloadIcon className="size-3 mr-2" /> Reset all stats
                    </>
                }
            />
            <TypeToConfirmAlertDialog
                title="Are you sure you want to reset all tasks?"
                description="This action cannot be undone. This will permanently delete all tasks. Meaning a fresh start. Stats will remain."
                onConfirm={handleResetTasks}
                confirmText={group.name}
                buttonContent={
                    <>
                        <ReloadIcon className="size-3 mr-2" /> Reset all tasks
                    </>
                }
            />
        </div>
    );
}
