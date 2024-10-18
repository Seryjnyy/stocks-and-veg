import { UserAvatar } from "@/components/group/group-user-profile";
import { useGetUserProfile } from "@/hooks/supabase/profile/use-get-profile";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";

interface ChatPresenceUserMessageProps {
    userID: string;
    event: "joined" | "left";
}

export default function ChatPresenceUserMessage({
    userID,
    event,
}: ChatPresenceUserMessageProps) {
    const {
        data: user,
        isLoading,
        isError,
    } = useGetUserProfile({ user_id: userID });

    if (!user || isLoading || isError) return null;

    return (
        <div className="flex gap-2 text-sm">
            <UserAvatar user={user} size={"xs"}>
                <div className="backdrop-brightness-50 w-full h-full flex justify-center items-center">
                    {event == "joined" ? <EnterIcon /> : <ExitIcon />}
                </div>
            </UserAvatar>

            <span className="text-muted-foreground max-w-[15rem] md:max-w-[20rem] break-words">
                {user.username}
            </span>
            <span>{event}</span>
        </div>
    );
}
