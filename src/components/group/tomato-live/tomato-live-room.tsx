import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CountdownTimer from "@/components/countdown-timer";
import {
    avatarVariants,
    GroupUserAvatar,
    UserAvatar,
} from "@/components/group/group-user-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useScreenSize from "@/hooks/use-screen-size";
import { toast, useToast } from "@/hooks/use-toast";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";
import { useGetUserProfile } from "@/lib/hooks/queries/use-get-profile";
import supabase from "@/lib/supabase/supabaseClient";
import { useGetGroupUserTomato } from "@/lib/tomatoService";
import { cn, getExpiryDateUnixFromDate, TOMATO_EMOJI } from "@/lib/utils";
import {
    ArrowLeftIcon,
    CaretDownIcon,
    CaretUpIcon,
    ChatBubbleIcon,
    EnterIcon,
    ExitIcon,
} from "@radix-ui/react-icons";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { differenceInMilliseconds } from "date-fns";
import debounce from "lodash/debounce";
import {
    ArrowDownIcon,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Loader2,
    Users,
    Users2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Timeout } from "node_modules/@tanstack/react-router/dist/esm/utils";
import { useChatSubscription } from "./use-chat-subscription";
import { useCreateChatMsg } from "./use-create-chat-msg";
import { Tables } from "@/lib/supabase/database.types";
import { useGetTomatoTargetChatMsgs } from "./use-get-tomato-target-chat-msgs";
import SpinnerButton from "@/spinner-button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { Provider, useStore } from "jotai";
import BackButton from "@/components/back-button";
import { atom, createStore, useAtom } from "jotai";
import { Toast, ToastAction } from "@/components/ui/toast";

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

interface TestProps {
    targetUser: GroupUserWithProfile;
    currentUser: GroupUserWithProfile;
}

// TODO : when user joins, updated state, then need to fetch their groupUser and profile data using user_id
// Then also need to refetch their group data whenever they send a message that they threw stuff
// TODO : in parent component make sure user can't get here if not authorised

const sessionErrorAtom = atom("");
const isSessionValidAtom = atom(false);

export function TomatoLiveRoom({ targetUser, currentUser }: TestProps) {
    return (
        <Provider>
            <TomatoLiveRoomComponent
                targetUser={targetUser}
                currentUser={currentUser}
            />
        </Provider>
    );
}

export function TomatoLiveRoomComponent({
    targetUser,
    currentUser,
}: TestProps) {
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
    const [sessionError, setSessionError] = useAtom(sessionErrorAtom);
    const [isSessionValid, setIsSessionValid] = useAtom(isSessionValidAtom);

    // TODO : idk if better to have this here or directly in chat
    const { status } = useChatSubscription({
        channelName: `${targetUserTomato?.id}-db`,
        tomatoTargetID: targetUserTomato?.id ?? "",
    });

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
        const tempChannel = supabase.channel("room1", {
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
            // supabase.removeAllChannels()
            cleanUp();
        };
    }, []);

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
            } else {
                console.log("CHECKED FINE");
            }
            console.log(dateNow > dateCreated ? "true" : "false");
        }
    }, [targetUserTomato]);

    // TODO : debounce not working, making multiple calls regardless
    // const intermediate = debounce(() => {
    //     handleThrowTomato();
    //     // setTomatoesThrownCount(0);
    // }, 1000);

    const handleClick = () => {
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
                    className="size-16 text-3xl bg-red-950 select-none "
                    onClick={handleClick}
                    disabled={!isAbleToThrowTomato}
                >
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

const ChatUserPresenceMsg = ({
    userID,
    event,
}: {
    userID: string;
    event: "joined" | "left";
}) => {
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
};

const ChatTomatoMsg = ({ userID, id }: { userID: string; id: number }) => {
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
};

const ChatMsg = ({ userID, message }: { userID: string; message: string }) => {
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
};

// TODO : If I want to have indicators for presence updates when chat is closed, I will have to lift the state up cause this doesn't run if collapsed
// TODO : this is really strange, it doesn't show up sometimes initially, like at all, not even rendered
const ChatPresence = ({ channel }: { channel?: RealtimeChannel }) => {
    const [event, setEvent] = useState<{
        id: number;
        event: string;
        userID: string;
    } | null>(null);

    useEffect(() => {
        let timeoutID: Timeout | null = null;

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
                <ChatUserPresenceMsg
                    userID={event.userID}
                    event={event.event as "joined" | "left"}
                />
            )}
            {event && event.event == "tomato" && (
                <ChatTomatoMsg userID={event.userID} id={event.id} />
            )}
        </div>
    );
};

// TODO : sending a message should scroll to the most recent message
// TODO : indicator for new messages user hasn't seen, would have to move out of collapsible content
const Chat = ({
    tomatoTarget,
    isOpen,
}: {
    tomatoTarget?: Tables<"tomato_target">;
    isOpen: boolean;
}) => {
    const {
        data: chatMsgs,
        isLoading: isMsgsLoading,
        isError: isMsgError,
    } = useGetTomatoTargetChatMsgs({
        tomatoTargetID: tomatoTarget?.id ?? "",
    });

    console.log(status);

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
                            <ChatMsg
                                userID={msg.user_id}
                                message={msg.message}
                            />
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

const ChatSection = ({
    testUser,
    channel,
    tomatoTarget,
}: {
    testUser: GroupUserWithProfile;
    channel?: RealtimeChannel;
    tomatoTarget?: Tables<"tomato_target">;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild className="mx-2 my-2">
                <Button
                    variant={"outline"}
                    size={"sm"}
                    className="flex gap-1 z-50"
                >
                    <ChatBubbleIcon />
                    {isOpen ? <CaretDownIcon /> : <CaretUpIcon />}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
                className={cn(
                    "animate-in fade-in-0 duration-300 hidden  ",
                    isOpen && "block"
                )}
                forceMount
            >
                <section className="w-full   h-[16rem] flex flex-col relative backdrop-blur-sm animate-in slide-in-from-bottom-14 duration-300">
                    <div className="absolute -top-1 left-0 right-0 h-[70%] bg-gradient-to-b from-background to-transparent pointer-events-none z-10 "></div>
                    <ScrollArea className="flex-1 max-h-full  ">
                        <Chat tomatoTarget={tomatoTarget} isOpen={isOpen} />
                    </ScrollArea>
                    <footer className="">
                        <ChatPresence channel={channel} />
                    </footer>
                </section>
            </CollapsibleContent>
        </Collapsible>
    );
};

const Reactions = ({ channel }: { channel?: RealtimeChannel }) => {
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
};

const chatInputSchema = z.object({
    message: z.string().min(1).max(200),
});

type chatInputSchemaType = z.infer<typeof chatInputSchema>;

const ChatInput = ({
    currentUser,
    tomatoTarget,
}: {
    currentUser: GroupUserWithProfile;
    tomatoTarget: Tables<"tomato_target"> | undefined;
}) => {
    const [isSessionValid] = useAtom(isSessionValidAtom);

    const {
        mutate,
        isPending: isSending,
        isError: isSendingError,
    } = useCreateChatMsg();

    const { toast } = useToast();

    const form = useForm<chatInputSchemaType>({
        resolver: zodResolver(chatInputSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit = (values: chatInputSchemaType) => {
        if (!isSessionValid) return;

        const msg = values.message.trim();
        form.reset();

        // Check if msg is only whitespace
        if (msg.length == 0) {
            return;
        }

        handleSend(msg);
    };

    const handleSend = (message: string) => {
        if (!tomatoTarget || !currentUser || !isSessionValid) return;

        mutate(
            [
                {
                    message: message,
                    group_user_id: currentUser.id,
                    group_id: tomatoTarget.group_id,
                    tomato_target_id: tomatoTarget.id,
                },
            ],
            {
                onError: (error) => {
                    toast({
                        title: "Error sending message",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            }
        );
    };

    return (
        <div className="flex gap-3 items-center mx-auto w-fit">
            {currentUser.profile && (
                <UserAvatar user={currentUser.profile} size={"sm"} />
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-3 items-center"
                >
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="p-0 m-0 h-fit  relative space-y-0">
                                <FormLabel className="sr-only">
                                    Message
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="max-w-[15rem] md:max-w-[28rem] min-w-[15rem] md:min-w-[28rem] border"
                                        placeholder="Add comment..."
                                        {...field}
                                        disabled={!isSessionValid}
                                    />
                                </FormControl>
                                <FormMessage className="absolute text-xs" />
                            </FormItem>
                        )}
                    />
                    <SpinnerButton
                        className="px-3"
                        disabled={
                            !tomatoTarget ||
                            isSending ||
                            isSendingError ||
                            form.getValues().message.length == 0 ||
                            !isSessionValid
                        }
                        isPending={isSending}
                    >
                        <ArrowUp className="size-4 " />
                    </SpinnerButton>
                </form>
            </Form>
        </div>
    );
};

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
                <ChatSection
                    testUser={currentUser}
                    channel={channel}
                    tomatoTarget={tomatoTarget ?? undefined}
                />
            </div>
            <div className="w-full bg-secondary/30 p-4">
                <Reactions channel={channel} />
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
