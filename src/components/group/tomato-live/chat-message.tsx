import {
    avatarVariants,
    UserAvatar,
} from "@/components/group/group-user-profile";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
    userID: string;
    message: string;
}

export default function ChatMessage({ userID, message }: ChatMessageProps) {
    const {
        data: user,
        isLoading,
        isError,
    } = useGetUserProfile({ user_id: userID });

    // TODO : do better here
    if (!user || isLoading || isError) return null;

    return (
        <div className="w-full p-2 select-none">
            <div className="flex gap-2">
                <div>
                    {user ? (
                        <UserAvatar user={user} size={"xs"} />
                    ) : (
                        <div
                            className={cn(
                                avatarVariants({ size: "xs" }),
                                "bg-gray-700 rounded-lg"
                            )}
                        ></div>
                    )}
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-sm text-muted-foreground max-w-[10rem] truncate">
                        {user.username}
                    </span>
                    <span className="max-w-[15rem] md:max-w-[20rem] break-words">
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
}
