import { useGetGroup } from "@/lib/hooks/queries/use-get-group";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";
import { useAuth } from "@/hooks/use-auth";
import { CrownIcon, User2 } from "lucide-react";
import { Badge } from "../ui/badge";
import GroupUserDialog from "./group-user-dialog";
import { ReactNode } from "@tanstack/react-router";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { Tables } from "@/lib/supabase/database.types";

const avatarVariants = cva("overflow-visible relative", {
    variants: {
        size: {
            xs: "size-6",
            sm: "size-8",
            md: "size-10",
            lg: "size-12",
            xl: "size-16",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

export interface GroupUserAvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof avatarVariants> {
    groupUser: GroupUserWithProfile;
    usBadge?: boolean;
    creatorBadge?: boolean;
    children?: ReactNode;
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash); // hash * 31 + charCode
    }
    return hash;
}

function stringToRGB(str: string): string {
    // Generate a hash from the string
    const hash = hashString(str);

    // Extract RGB values from the hash
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    return `rgba(${r}, ${g}, ${b}, 1)`;
}

interface UserAvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof avatarVariants> {
    user: Tables<"profile">;
}
export const UserAvatar = ({
    user,
    size,
    className,
    children,
}: UserAvatarProps) => {
    return (
        <Avatar className={cn(avatarVariants({ size, className }))}>
            <AvatarFallback
                className="relative overflow-visible"
                style={{
                    backgroundImage: `linear-gradient(to top, ${stringToRGB(user.user_id)}, ${stringToRGB(user.id)})`,
                }}
            >
                {children}
            </AvatarFallback>
        </Avatar>
    );
};

export const GroupUserAvatar = ({
    groupUser,
    usBadge,
    creatorBadge,
    size,
}: GroupUserAvatarProps) => {
    const { session } = useAuth();
    const { data } = useGetGroup({
        groupID: groupUser?.group_id ?? "",
        enabled: !!groupUser,
    });

    const isUs = session && session?.user.id == groupUser?.user_id;

    const isCreator = data && data.creator_id == groupUser?.user_id;

    if (!groupUser?.profile) {
        return null;
    }

    return (
        <UserAvatar user={groupUser?.profile} size={size}>
            {usBadge && isUs ? (
                <Badge className="px-1 -bottom-1 absolute -left-2 opacity-90">
                    <User2 className="size-[0.6rem]" />
                </Badge>
            ) : null}

            {creatorBadge && isCreator ? (
                <Badge className="px-1 -bottom-1 absolute -right-2 opacity-90">
                    <CrownIcon className="size-[0.6rem]" />
                </Badge>
            ) : null}
        </UserAvatar>
    );
};

export const GroupUser = ({
    groupUser,
    children,
    className,
    usBadge = false,
    creatorBadge = false,
    small,
}: {
    groupUser: GroupUserWithProfile;
    children?: ReactNode;
    className?: string;
    small?: boolean;
    usBadge?: boolean;
    creatorBadge?: boolean;
}) => {
    return (
        <div
            className={cn(
                "flex items-center gap-4 border p-3 border-dashed w-fit rounded-lg",
                className
            )}
        >
            <GroupUserAvatar
                groupUser={groupUser}
                usBadge={usBadge}
                creatorBadge={creatorBadge}
            />
            <div className={small ? "max-w-[6rem]" : ""}>
                <div>{groupUser.profile?.username}</div>
                <div className="text-xs text-muted-foreground">
                    {groupUser.user_id.split("-")[0]}
                </div>
                <div className="flex items-center text-xs gap-2 text-muted-foreground">
                    <span>2</span>
                    <Progress value={3} />
                    <span>3</span>
                </div>
            </div>
            {children}
        </div>
    );
};

// TODO : These components are hot garbage, but I can't stop using them
export default function GroupUserProfile({
    groupUser,
    className,
    small,
    usBadge = false,
    creatorBadge = false,
}: {
    groupUser: GroupUserWithProfile;
    className?: string;
    small?: boolean;
    usBadge?: boolean;
    creatorBadge?: boolean;
}) {
    return (
        <GroupUser
            groupUser={groupUser}
            className={className}
            small={small}
            usBadge={usBadge}
            creatorBadge={creatorBadge}
        >
            <div className="border-l pl-2">
                <GroupUserDialog groupUser={groupUser} />
            </div>
        </GroupUser>
    );
}
