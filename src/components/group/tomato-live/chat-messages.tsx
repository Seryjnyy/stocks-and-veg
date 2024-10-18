import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { ArrowDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useChatSubscription } from "./use-chat-subscription";
import { useGetTomatoTargetChatMsgs } from "./use-get-tomato-target-chat-msgs";
import ChatMessage from "./chat-message";

interface ChatMessagesProps {
    tomatoTarget: Tables<"tomato_target">;
    isOpen: boolean;
}

// TODO : sending a message should scroll to the most recent message
// TODO : indicator for new messages user hasn't seen, would have to move out of collapsible content
export default function ChatMessages({
    tomatoTarget,
    isOpen,
}: ChatMessagesProps) {
    const {
        data: chatMsgs,
        isLoading: isMsgsLoading,
        isError: isMsgError,
    } = useGetTomatoTargetChatMsgs({
        tomatoTargetID: tomatoTarget?.id ?? "",
    });

    const { status } = useChatSubscription({
        channelName: `${tomatoTarget?.id}-db`,
        tomatoTargetID: tomatoTarget.id,
        // callback: (payload) => {
        //     console.log("UPDATE", payload);
        // },
    });

    const { ref, inView } = useInView();
    const [initialRender, setInitialRender] = useState(true);
    const newestMsgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inView) {
            handleScrollToRecent();
        } else if (initialRender && newestMsgRef.current && isOpen) {
            // On initial render when we finally have the ref to the newest chat message scroll to it
            handleScrollToRecent("instant");

            // This is done so that the button doesn't flash on when chat is open
            // it flashes because it starts at the top and scrolls to to bottom of chat causing the button to be visible for that second before it gets to the bottom
            setTimeout(() => {
                setInitialRender(false);
            }, 500);
        }
        console.log("initial render", initialRender, newestMsgRef.current);
    }, [chatMsgs, inView, newestMsgRef, isOpen]);

    const handleScrollToRecent = (
        behavior: "smooth" | "auto" | "instant" = "smooth"
    ) => {
        if (newestMsgRef.current) {
            newestMsgRef.current.scrollIntoView({ behavior: behavior });
        } else {
            console.log("doesn't exist");
        }
    };

    // TODO : loading and error
    if (isMsgsLoading || isMsgError || !chatMsgs) return null;

    return (
        <div className="relative">
            {!initialRender && (
                <Button
                    variant={"secondary"}
                    className={cn(
                        "fixed -bottom-12 left-2 transition-all opacity-0 duration-0 delay-0",
                        {
                            "opacity-100 duration-500": !inView,
                        }
                    )}
                    onClick={() => handleScrollToRecent()}
                >
                    <ArrowDownIcon className="size-3 animate-bounce" />
                    <ChatBubbleIcon className="size-3 absolute top-0 right-0 text-blue-400" />
                </Button>
            )}

            <ul className=" h-full flex-col flex justify-end pt-12">
                {chatMsgs?.map((msg, index) => (
                    <div ref={ref} key={msg.id}>
                        <div
                            ref={
                                index == chatMsgs.length - 1
                                    ? newestMsgRef
                                    : undefined
                            }
                        >
                            <ChatMessage
                                userID={msg.user_id}
                                message={msg.message}
                            />
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}
