import React, { ReactNode, useState } from "react";
import GroupCreateForm from "./group-create-form";

import { useGetUserGroups } from "@/lib/hooks/queries/use-get-user-groups";
import { useAuth } from "@/hooks/use-auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CONFIG } from "@/lib/config";
import { Alert } from "../ui/alert";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function GroupCreateModal({
    children,
}: {
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const { session } = useAuth();
    const { data, refetch } = useGetUserGroups({ user_id: session?.user.id });

    const handleSuccess = () => {
        refetch();
        setOpen(false);
    };

    const isGroupLimitReached =
        data && data?.length >= CONFIG.maxGroups ? true : false;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Create group</span>
                        <span className="text-muted-foreground text-xs">
                            {data?.length ?? 0}/{CONFIG.maxGroups}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Create a new group by selecting a name.
                    </DialogDescription>
                </DialogHeader>
                {isGroupLimitReached && (
                    <Alert variant="warning" className="mb-2">
                        <AlertTriangle className="size-4 mr-2" />
                        <span>
                            You have reached the maximum number of groups.
                        </span>
                    </Alert>
                )}
                <GroupCreateForm
                    onSuccess={handleSuccess}
                    disabled={!data || isGroupLimitReached}
                />
            </DialogContent>
        </Dialog>
    );
}
