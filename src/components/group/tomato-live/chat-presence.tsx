import { useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import ChatPresenceTomatoMessage from "./chat-presence-tomato-message";
import ChatPresenceUserMessage from "./chat-presence-user-message";
import { useEffect } from "react";

interface ChatPresenceProps {
    channel?: RealtimeChannel;
}

// TODO : If I want to have indicators for presence updates when chat is closed, I will have to lift the state up cause this doesn't run if collapsed
// TODO : this is really strange, it doesn't show up sometimes initially, like at all, not even rendered
export default function ChatPresence({ channel }: ChatPresenceProps) {
    const [event, setEvent] = useState<{
        id: number;
        event: string;
        userID: string;
    } | null>(null);

    useEffect(() => {
        let timeoutID: NodeJS.Timeout | null = null;

        const handlePresenceEvent = (eventType: string, presences: any[]) => {
            if (presences && presences.length > 0) {
                if (timeoutID != null) {
                    clearTimeout(timeoutID);
                }

                setEvent({
                    id: Date.now(),
                    event: eventType,
                    userID: presences[0].user_id,
                });

                timeoutID = setTimeout(() => {
                    setEvent(null);
                }, 3000);
            }
        };

        channel
            ?.on("presence", { event: "join" }, ({ key, newPresences }) => {
                handlePresenceEvent("joined", newPresences);
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                handlePresenceEvent("left", leftPresences);
            })
            .on("broadcast", { event: "tomato_thrown" }, (payload) => {
                console.log("TOMATO THROWN EVENT");
                const res = payload.payload;

                if (!res || !res.userID) {
                    return;
                }

                handlePresenceEvent("tomato", [
                    { user_id: payload.payload.userID },
                ]);
            });
    }, [channel]);

    return (
        <div className="w-full border p-2 select-none pointer-events-none  min-h-11 ">
            {event && (event.event == "joined" || event.event == "left") && (
                <ChatPresenceUserMessage
                    userID={event.userID}
                    event={event.event as "joined" | "left"}
                />
            )}
            {event && event.event == "tomato" && (
                <ChatPresenceTomatoMessage
                    userID={event.userID}
                    id={event.id}
                />
            )}
        </div>
    );
}
