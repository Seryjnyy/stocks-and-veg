import { useGetGroup } from "@/hooks/supabase/group/use-get-group";
import { GroupUserWithProfile } from "@/hooks/supabase/group/use-get-group-users";
import { useAuth } from "@/hooks/use-auth";
import { CrownIcon, User2 } from "lucide-react";
import { Badge } from "../ui/badge";
import GroupUserDialog from "./group-user-dialog";
import { ReactNode } from "@tanstack/react-router";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cva, VariantProps } from "class-variance-authority";
import { Tables } from "@/lib/supabase/database.types";
import useLevel from "@/hooks/use-level";
import { useFileUrl } from "@supabase-cache-helpers/storage-react-query";
import supabase from "@/lib/supabase/supabaseClient";

export const avatarVariants = cva("overflow-visible relative", {
    variants: {
        size: {
            xs: "size-6",
            sm: "size-8",
            md: "size-10",
            lg: "size-12",
            xl: "size-16",
            "7xl": "size-40",
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

// TODO : Should separate stuff here i think, its not longer just a UI component but also has data fetching logic now
// TODO : yh this will be a mess, adding imgUrl option for the profile cropper only
export const UserAvatar = ({
    user,
    size,
    className,
    children,
    imgUrl,
}: UserAvatarProps & { imgUrl?: string }) => {
    const {
        data: url,
        isLoading,
        isError,
    } = useFileUrl(
        supabase.storage.from("avatar"),
        `${user.user_id}/${user.user_id}.png`,
        "private",
        {
            refetchOnWindowFocus: false,
            enabled: !imgUrl,
        }
    );

    console.log(url, isError, isLoading);

    return (
        <Avatar
            className={cn(
                avatarVariants({ size, className }),
                "overflow-hidden"
            )}
        >
            {url && !isLoading && !isError && !imgUrl && (
                <AvatarImage src={url} />
            )}
            {imgUrl && <AvatarImage src={imgUrl} />}
            <AvatarFallback
                className="relative overflow-visible"
                style={{
                    backgroundImage: `linear-gradient(to top, ${stringToRGB(user.user_id)}, ${stringToRGB(user.id)})`,
                }}
            ></AvatarFallback>
            {children}
        </Avatar>
    );
};

export const userDetailVariants = cva("text-start", {
    variants: {
        size: {
            responsive:
                "max-w-[8rem] min-w-[8rem] sm:max-w-[10rem] sm:min-w-[10rem] md:max-w-[14rem] md:min-w-[14rem]",
            xs: "max-w-[4rem] min-w-[4rem]",
            sm: "max-w-[6rem] min-w-[6rem]",
            md: "max-w-[8rem] min-w-[8rem]",
            lg: "max-w-[10rem] min-w-[10rem]",
            xl: "max-w-[12rem] min-w-[12rem]",
            "2xl": "max-w-[14rem] min-w-[14rem]",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

interface UserDetailProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof userDetailVariants> {
    user: Tables<"profile">;
}

export const UserDetail = ({ user, size, className }: UserDetailProps) => {
    return (
        <div className={cn(userDetailVariants({ size, className }))}>
            <div className="truncate">{user.username}</div>
            <div className="text-xs text-muted-foreground truncate">
                {user.user_id.split("-")[0]}
            </div>
        </div>
    );
};

export const GroupUserAvatar = ({
    groupUser,
    usBadge,
    creatorBadge,
    size,
    children,
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

            {children}
        </UserAvatar>
    );
};

const groupUserVariants = cva("h-fit", {
    variants: {
        variant: {
            default: "",
            dashed: "border-dashed border",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

interface GroupUserProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof groupUserVariants> {
    groupUser: GroupUserWithProfile;
    children?: ReactNode;
    className?: string;
    usBadge?: boolean;
    progressBar?: boolean;
    creatorBadge?: boolean;
    detailSize?: VariantProps<typeof userDetailVariants>["size"];
    avatarSize?: VariantProps<typeof avatarVariants>["size"];
}

const LevelProgress = ({ groupUser }: { groupUser: GroupUserWithProfile }) => {
    const levelData = useLevel({ xp: groupUser.xp });

    return (
        <div className="flex items-center text-xs gap-2 text-muted-foreground">
            <span className="text-[0.6rem]">{levelData.level}</span>
            <Progress value={levelData.progressToNextLevel} />
            <span className="text-[0.6rem]">{levelData.level + 1}</span>
        </div>
    );
};

export const GroupUser = ({
    groupUser,
    children,
    className,
    usBadge = false,
    creatorBadge = false,
    progressBar,
    detailSize,
    avatarSize,
    variant,
}: GroupUserProps) => {
    return (
        <div
            className={cn(
                "flex items-center  gap-4 p-3  w-fit rounded-lg",
                groupUserVariants({ variant, className })
            )}
        >
            <GroupUserAvatar
                groupUser={groupUser}
                usBadge={usBadge}
                creatorBadge={creatorBadge}
                size={avatarSize}
            />
            <div>
                {groupUser.profile && (
                    <UserDetail user={groupUser.profile} size={detailSize} />
                )}

                {progressBar && <LevelProgress groupUser={groupUser} />}
            </div>
            {children}
        </div>
    );
};

// TODO : Maybe change all this stuff to have user data optional, then pass in id and fetch data in the component, so error
// and loading states are handled in this component
export default function GroupUserProfile({
    groupUser,
    className,
    usBadge = false,
    creatorBadge = false,
    progressBar,
    detailSize,
    avatarSize,
    variant,
    viewMore = false,
}: {
    groupUser: GroupUserWithProfile;
    className?: string;
    usBadge?: boolean;
    creatorBadge?: boolean;
    progressBar?: boolean;
    viewMore?: boolean;
    detailSize?: VariantProps<typeof userDetailVariants>["size"];
    avatarSize?: VariantProps<typeof avatarVariants>["size"];
    variant?: VariantProps<typeof groupUserVariants>["variant"];
}) {
    return (
        <GroupUser
            groupUser={groupUser}
            className={className}
            usBadge={usBadge}
            creatorBadge={creatorBadge}
            detailSize={detailSize}
            avatarSize={avatarSize}
            variant={variant}
            progressBar={progressBar}
        >
            {viewMore ? (
                <div className="border-l pl-2">
                    <GroupUserDialog groupUser={groupUser} />
                </div>
            ) : null}
        </GroupUser>
    );
}
