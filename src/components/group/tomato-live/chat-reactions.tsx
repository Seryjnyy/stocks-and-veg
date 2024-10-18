import { isSessionValidAtom } from "./tomato-live-room";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import useScreenSize from "@/hooks/use-screen-size";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

interface ChatReactionsProps {
    channel?: RealtimeChannel;
}

export default function ChatReactions({ channel }: ChatReactionsProps) {
    const { session } = useAuth();
    const [reactions, setReactions] = useState<
        { id: number; reaction: string; timestamp: number }[]
    >([]);

    const [isSessionValid] = useAtom(isSessionValidAtom);
    const screenSize = useScreenSize();
    let emojis = ["🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗"];
    emojis = screenSize == "xs" ? emojis.slice(0, 7) : emojis;

    // TODO : maybe have some delay between each press
    const handleReaction = (emoji: string) => {
        if (!session || !channel || !isSessionValid) return;

        channel.send({
            type: "broadcast",
            event: "reaction",
            payload: { emoji: emoji, userID: session.user.id },
        });

        setReactions((prev) => [
            ...prev,
            { id: Date.now(), reaction: emoji, timestamp: Date.now() },
        ]);
    };

    useEffect(() => {
        channel?.on("broadcast", { event: "reaction" }, (payload) => {
            const res = payload.payload;

            if (!res || !res.emoji || !res.userID) return;

            // TODO : for now its sending us the broadcast too, not sure if I need to do that yet, so for now I will just leave it
            // and add some checks for it, but if turns out not needed then remove these, there will be one in throw tomatoes too
            if (res.userID == session?.user.id) return;

            setReactions((prev) => [
                ...prev,
                { id: Date.now(), reaction: res.emoji, timestamp: Date.now() },
            ]);
        });
    }, [channel]);

    useEffect(() => {
        // TODO : idk if having this interval is bad, it runs every 5 seconds
        // TODO : also every time it clears up it removes all emojis on the screen which can be a bit jarring
        // thats why the time is set to 10seconds so it happens less, but if you do too much time will it be a problem?
        // TODO: yh I don't like how it just cuts off suddenly because of the clean up
        const cleanup = setInterval(() => {
            setReactions((prev) =>
                prev.filter(
                    (reaction) => Date.now() - reaction.timestamp < 10000
                )
            );
        }, 10000);

        return () => {
            clearInterval(cleanup);
        };
    }, []);

    return (
        <div className="flex justify-center gap-2 ">
            {emojis.map((emoji, index) => (
                <Button
                    key={index}
                    variant={"ghost"}
                    className="text-xl px-3 select-none "
                    onClick={() => handleReaction(emoji)}
                    disabled={!channel || !isSessionValid}
                >
                    {emoji}
                </Button>
            ))}
            <div className="fixed bottom-36 md:right-20 sm:right-10 right-5  p-3 flex justify-center">
                {reactions.map((reaction, index) => (
                    <div
                        key={index}
                        className="text-4xl px-2 absolute  top-0 animate-reaction select-none"
                    >
                        {reaction.reaction}
                    </div>
                ))}
            </div>
        </div>
    );
}
