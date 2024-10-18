import { useGetUserProfile } from "@/hooks/supabase/profile/use-get-profile";
import { UserAvatar } from "@/components/group/group-user-profile";
import { TOMATO_EMOJI } from "@/lib/utils";

interface ChatPresenceTomatoMessageProps {
    userID: string;
    id: number;
}

export default function ChatPresenceTomatoMessage({
    userID,
    id,
}: ChatPresenceTomatoMessageProps) {
    const {
        data: user,
        isLoading,
        isError,
    } = useGetUserProfile({ user_id: userID });

    if (!user || isLoading || isError) return null;

    return (
        <div
            className={`flex gap-2 text-sm animate-in fade-in-0 slide-in-from-left-14 duration-300`}
            key={id}
        >
            <UserAvatar user={user} size={"xs"}>
                <div className="backdrop-brightness-60 w-full h-full flex justify-center items-center">
                    {TOMATO_EMOJI}
                </div>
            </UserAvatar>
            <span className="text-muted-foreground max-w-[8rem] md:max-w-[15rem] truncate">
                {user.username}{" "}
            </span>
            <span>threw a tomato</span>
        </div>
    );
}
