import { CONFIG } from "@/lib/config";

import {
    GroupUserWithProfile,
    useGetGroupUsers,
} from "@/lib/hooks/queries/use-get-group-users";
import GroupUserProfile from "../group-user-profile";

export default function Users({ groupID }: { groupID: string }) {
    const { data, error } = useGetGroupUsers({
        groupID: groupID,
    });

    if (error) {
        return <div>error</div>;
    }

    return (
        <>
            <span className="absolute -top-6 right-0 text-xs text-muted-foreground">
                {(data || []).length}/{CONFIG.maxGroupUsers}
            </span>
            <div>
                <ul className="flex  gap-2 flex-wrap justify-center">
                    <UserList users={data || []} />
                </ul>
            </div>
        </>
    );
}

const UserList = ({ users }: { users: GroupUserWithProfile[] }) => {
    return users.map((user) => (
        <GroupUserProfile
            groupUser={user}
            key={user.id}
            progressBar={true}
            usBadge
            creatorBadge
            viewMore
            variant="dashed"
            detailSize={"responsive"}
        />
    ));
};
