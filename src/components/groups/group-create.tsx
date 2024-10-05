import React from "react";
import GroupCreateForm from "./group-create-form";
import { useGetUserGroups } from "@/lib/hooks/queries/use-get-user-groups";
import { useAuth } from "@/lib/hooks/use-auth";

export default function GroupCreate() {
    const { session } = useAuth();
    const { refetch } = useGetUserGroups({ user_id: session?.user.id });

    const handleSuccess = () => {
        refetch();
    };

    return (
        <div>
            <h1>Create group</h1>
            <GroupCreateForm onSuccess={handleSuccess} />
        </div>
    );
}
