import BackButton from "@/components/back-button";
import CountdownTimer from "@/components/countdown-timer";
import { GroupUserAvatar } from "@/components/group/group-user-profile";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import useWorkStatus from "@/hooks/use-work-status";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import { Tables } from "@/lib/supabase/database.types";
import supabase from "@/lib/supabase/supabaseClient";
import { useGetGroupUserTomato } from "@/lib/tomatoService";
import { cn, getExpiryDateUnixFromDate, TOMATO_EMOJI } from "@/lib/utils";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { differenceInMilliseconds } from "date-fns";
import { atom, Provider, useAtom } from "jotai";
import { ArrowLeft, Clock, Loader2, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import Chat from "./chat";
import ChatInput from "./chat-input";
import ChatReactions from "./chat-reactions";

const OnlineMark = () => {
    return <div className="size-2 rounded-full bg-green-500 "></div>;
};

const User = ({ userID, groupID }: { userID: string; groupID: string }) => {
    const { data, isError, isLoading } = useGetUserProfile({ user_id: userID });
    const {
        data: groupUser,
        isError: isGroupUserError,
        isLoading: isGroupUserLoading,
    } = useGetGroupUser({ userID: userID, groupID: groupID });

    // TODO : handel
    if (isError || isGroupUserError) return null;

    // TODO : Loading

    return (
        <div className="flex-col items-center justify-center flex w-full sm:w-[10rem] md:w-[16rem] border p-2 relative rounded-md">
            <div className="absolute top-1 right-1">
                <OnlineMark />
            </div>
            {groupUser ? (
                <GroupUserAvatar groupUser={groupUser} usBadge />
            ) : (
                <div className="size-12 rounded-lg bg-blue-300"></div>
            )}
            <div>{data?.username}</div>
            <div className="flex flex-col">
                <span className="text-sm"> Tomatoes {TOMATO_EMOJI}</span>
                <div className="flex flex-col pl-2 text-xs">
                    <span>Thrown : not yet</span>
                    <span>Available : {groupUser?.tomatoes}</span>
                </div>
            </div>
        </div>
    );
};

interface TomatoLiveRoomProps {
    targetUser: GroupUserWithProfile;
    currentUser: GroupUserWithProfile;
}

// TODO : when user joins, updated state, then need to fetch their groupUser and profile data using user_id
// Then also need to refetch their group data whenever they send a message that they threw stuff
// TODO : in parent component make sure user can't get here if not authorised

export const isSessionValidAtom = atom(true);

export function TomatoLiveRoom({
    targetUser,
    currentUser,
}: TomatoLiveRoomProps) {
    return (
        <Provider>
            <Room targetUser={targetUser} currentUser={currentUser} />
        </Provider>
    );
}

export function Room({ targetUser, currentUser }: TomatoLiveRoomProps) {
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const queryClient = useQueryClient();
    const [threwTomato, setThrewTomato] = useState(false);
    const [tomatoesThrownCount, setTomatoesThrownCount] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    const [otherAnimKey, setOtherAnimKey] = useState(0);
    // const [isOutOfTime, setIsOutOfTime] = useState(false);
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);
    const { toast } = useToast();

    const {
        data: targetUserTomato,
        isError,
        isLoading,
        refetch,
    } = useGetGroupUserTomato({
        userID: targetUser.user_id,
        groupID: targetUser.group_id,
    });

    const [isSessionValid, setIsSessionValid] = useAtom(isSessionValidAtom);
    const isWorkEnabled = useWorkStatus();

    const handleThrowTomato = async () => {
        // console.log(targetUserTomato);
        console.log("chuckding tomato");
        if (!targetUserTomato) {
            // TODO : probably should handle that
            console.error("Tomato target data is missing.");
            return;
        }

        channel?.send({
            type: "broadcast",
            event: "tomato_thrown",
            payload: { userID: currentUser.user_id },
        });
    };

    useEffect(() => {
        if (!targetUserTomato) return;

        const tempChannel = supabase.channel("targetUserTomato.id", {
            config: { broadcast: { self: true } },
        });
        tempChannel
            .on("presence", { event: "sync" }, () => {
                console.log(
                    "Synced presence state: ",
                    tempChannel.presenceState()
                );
                const userIDs = new Set<string>();
                for (const id in tempChannel.presenceState()) {
                    // @ts-ignore
                    userIDs.add(tempChannel.presenceState()[id][0].user_id);
                }

                setOnlineUsers(Array.from(userIDs));
            })
            .on("broadcast", { event: "tomato_thrown" }, () => {
                setOtherAnimKey(Math.random() * 100);
                console.log("TOMATO THROWN");
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await tempChannel.track({
                        online_at: new Date().toISOString(),
                        user_id: currentUser.user_id,
                    });
                }
            });

        setChannel(tempChannel);

        return () => {
            const cleanUp = async () => {
                await tempChannel.unsubscribe();
            };
            // setChannel(null);

            tempChannel && supabase.removeChannel(tempChannel);
            cleanUp();
        };
    }, [targetUserTomato]);

    useEffect(() => {
        if (targetUserTomato) {
            const timeDiff = Math.abs(
                differenceInMilliseconds(
                    Date.parse(targetUserTomato.created_at),
                    Date.parse(new Date().toISOString())
                )
            );
            console.log("🚀 ~ useEffect ~ timeDiff:", timeDiff);

            const dateNow = Date.parse(new Date().toISOString());
            const dateCreated = Date.parse(targetUserTomato.created_at);

            if (
                targetUserTomato &&
                dateNow >
                    Date.parse(
                        getExpiryDateUnixFromDate(
                            Date.parse(targetUserTomato.created_at)
                        ).toString()
                    )
            ) {
                console.log("CHECKED EXPIRED!");
                // setIsOutOfTime(dateNow > dateCreated);
                if (dateNow > dateCreated) {
                    setIsSessionValid(false);

                    toast({
                        title: "Session has ended. You can't throw tomatoes anymore.",
                        variant: "warning",
                        action: (
                            <Link
                                to="/groups/$groupID"
                                params={{ groupID: currentUser.group_id }}
                            >
                                <ToastAction
                                    altText="Go back to group page."
                                    className="group"
                                >
                                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-all mr-2" />
                                    Back
                                </ToastAction>
                            </Link>
                        ),
                    });
                }
                setIsSessionValid(false);
            } else {
                console.log("CHECKED FINE");
            }
            console.log(dateNow > dateCreated ? "true" : "false");
        }
    }, [targetUserTomato]);

    useEffect(() => {
        if (!isWorkEnabled) {
            setIsSessionValid(false);
        }
    }, [isWorkEnabled]);

    // TODO : debounce not working, making multiple calls regardless
    // const intermediate = debounce(() => {
    //     handleThrowTomato();
    //     // setTomatoesThrownCount(0);
    // }, 1000);

    const handleClick = () => {
        if (!isWorkEnabled) return;

        if (currentUser.tomatoes <= 0) {
            toast({
                title: "You don't have any tomatoes to throw.",
                variant: "warning",
            });
            return;
        }

        // setTomatoesThrownCount((prev) => prev + 1);

        // setAnimKey((prev) => prev + 1);
        // intermediate();
        handleThrowTomato();
    };

    const isAbleToThrowTomato =
        channel &&
        currentUser.tomatoes > 0 &&
        isSessionValid &&
        targetUser.user_id != currentUser.user_id;

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] ">
            <div className="fixed bottom-48  right-6 flex flex-col z-50">
                <span
                    className={cn(
                        "text-xs text-center select-none flex pl-3 items-center pb-1",
                        !isAbleToThrowTomato && "opacity-60"
                    )}
                >
                    {currentUser.tomatoes} {TOMATO_EMOJI}
                    {threwTomato && <Loader2 className="animate-spin size-3" />}
                </span>
                <Button
                    className="size-16 text-3xl bg-red-950 select-none relative"
                    onClick={handleClick}
                    disabled={!isAbleToThrowTomato || !isWorkEnabled}
                >
                    {!isWorkEnabled && (
                        <Clock className="size-5 mr-2 absolute top-1 left-1 text-blue-400" />
                    )}
                    {TOMATO_EMOJI}
                </Button>
            </div>
            <div className=" h-full flex flex-col justify-between   grid-cols-1 ">
                <div className="flex justify-between items-center px-2 pt-1">
                    <Link
                        to="/groups/$groupID"
                        params={{ groupID: currentUser.group_id }}
                    >
                        <BackButton />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users2 className="size-3" />
                            {onlineUsers.length} users
                        </div>
                        <div className="text-muted-foreground text-xs space-x-2 border-l pl-2">
                            {!isSessionValid && (
                                <span className="text-destructive">
                                    Session has ended
                                </span>
                            )}
                            {targetUserTomato && (
                                <CountdownTimer
                                    expireDate={Date.parse(
                                        targetUserTomato.created_at
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center  w-full items-start">
                    <div className="py-[8rem]">
                        <div>
                            <div className=" py-4 px-12 bg-orange-950 flex items-end gap-4 rounded-md ">
                                <div className="size-6 bg-emerald-600 rounded-lg"></div>
                                <GroupUserAvatar
                                    groupUser={targetUser}
                                    className="size-12"
                                    usBadge
                                >
                                    {/* TODO : Don't render animation on initial render */}
                                    {animKey > 0 && (
                                        <div
                                            className="w-full h-full bg-red-700 absolute -right-4 -bottom-4 animate-explosion rounded-full"
                                            key={animKey}
                                        ></div>
                                    )}
                                    {otherAnimKey > 0 && (
                                        <div
                                            className="w-full h-full bg-red-700 absolute -left-4 -bottom-4 animate-explosion rounded-full"
                                            key={otherAnimKey}
                                        ></div>
                                    )}
                                </GroupUserAvatar>
                                <div className="size-6 bg-emerald-600 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center flex-col">
                            <div className="font-bold relative  w-fit">
                                {targetUser.profile?.username}
                                <div className="absolute top-1 -right-2">
                                    {onlineUsers.includes(
                                        targetUser.user_id
                                    ) && <OnlineMark />}
                                </div>
                            </div>
                            <div className="text-xs  relative text-muted-foreground">
                                Tomatoes received:{" "}
                                <span className="font-semibold">
                                    {targetUserTomato?.tomatoes_received}
                                </span>
                                {threwTomato && (
                                    <Loader2 className="animate-spin size-3 absolute -right-4 bottom-0.5" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-fit ">
                    <ul className="flex  gap-8 px-6 flex-wrap py-8">
                        {onlineUsers
                            .filter((user) => user != targetUser.user_id)
                            .map((user) => (
                                <User
                                    key={user}
                                    userID={user}
                                    groupID={targetUser.group_id}
                                />
                            ))}
                    </ul>
                </div>
            </div>

            <Footer
                currentUser={currentUser}
                channel={channel ?? undefined}
                tomatoTarget={targetUserTomato ?? undefined}
            />
        </div>
    );
}

const Footer = ({
    currentUser,
    channel,
    tomatoTarget,
}: {
    currentUser: GroupUserWithProfile;
    channel?: RealtimeChannel;
    tomatoTarget?: Tables<"tomato_target">;
}) => {
    return (
        <footer className="fixed bottom-0 w-full ">
            <div className="relative">
                <Chat
                    channel={channel}
                    tomatoTarget={tomatoTarget ?? undefined}
                />
            </div>
            <div className="w-full bg-secondary/30 p-4">
                <ChatReactions channel={channel} />
            </div>
            <div className=" bg-secondary/50 w-full p-4">
                <ChatInput
                    currentUser={currentUser}
                    tomatoTarget={tomatoTarget}
                />
            </div>
        </footer>
    );
};
