import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { useAuth } from "@/lib/hooks/use-auth";
import supabase from "@/lib/supabase/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/test")({
    component: TestWrapper,
});

function TestWrapper() {
    return <Test />;
}

const User = ({ userID }: { userID: string }) => {
    const { data, isError, isLoading } = useGetUserProfile({ user_id: userID });

    // TODO : handel
    if (isError) return null;

    return (
        <div className="flex-col items-center justify-center flex w-[10rem] border">
            <div className="w-5 h-5 bg-blue-300"></div>
            <div>{data?.username}</div>
        </div>
    );
};

function Test() {
    const { session } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const mapInitialUsers = (channel: RealtimeChannel, roomID: string) => {
        const state = channel.presenceState();
        const _users = state[roomID];
        console.log("🚀 ~ mapInitialUsers ~ _users:", _users);
    };

    useEffect(() => {
        if (!session) {
            setOnlineUsers([]);
            return;
        }

        // const roomOne = supabase.channel("room", {
        //     config: { presence: { key: "what" } },
        // });

        setOnlineUsers((prev) =>
            prev.includes(session.user.id) ? prev : [...prev, session.user.id]
        );

        const channel = supabase.channel("room1");
        channel
            .on("presence", { event: "sync" }, () => {
                console.log("Synced presence state: ", channel.presenceState());
                const userIDs = new Set<string>();
                // const userIDs = [];
                for (const id in channel.presenceState()) {
                    // @ts-ignore
                    userIDs.add(channel.presenceState()[id][0].user_id);
                }

                setOnlineUsers(Array.from(userIDs));
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        user_id: session.user.id,
                    });
                }
            });
        // roomOne
        //     .on("presence", { event: "sync" }, () => {
        //         const newState = roomOne.presenceState();
        //         console.log("sync", newState);
        //         mapInitialUsers(roomOne, "what");
        //     })
        //     .on(
        //         "presence",
        //         { event: "join" },
        //         ({ key, newPresences, currentPresences, event }) => {
        //             console.log(
        //                 "join",
        //                 key,
        //                 newPresences,
        //                 currentPresences,
        //                 event
        //             );
        //         }
        //     )
        //     .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        //         console.log("leave", key, leftPresences);
        //     })
        //     .on("broadcast", { event: "test" }, (payload) => {
        //         console.log("broadcast", payload.payload);
        //     })
        //     .subscribe();

        console.log(onlineUsers);

        return () => {
            const cleanUp = async () => {
                await channel.unsubscribe();
            };

            channel && supabase.removeChannel(channel);
            // supabase.removeAllChannels()
            cleanUp();
        };
    }, [session]);

    console.log("channels", supabase.getChannels());

    return (
        <div>
            <div>{onlineUsers.length} users</div>
            <div>
                {onlineUsers.map((user) => (
                    <User key={user} userID={user} />
                ))}
            </div>
        </div>
    );
}
