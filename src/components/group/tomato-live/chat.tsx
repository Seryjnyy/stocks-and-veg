import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";
import { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import {
    CaretDownIcon,
    CaretUpIcon,
    ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useState } from "react";
import ChatMessages from "./chat-messages";
import ChatPresence from "./chat-presence";

interface ChatProps {
    channel?: RealtimeChannel;
    tomatoTarget?: Tables<"tomato_target">;
}

export default function Chat({ channel, tomatoTarget }: ChatProps) {
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
                        {tomatoTarget && (
                            <ChatMessages
                                tomatoTarget={tomatoTarget}
                                isOpen={isOpen}
                            />
                        )}
                    </ScrollArea>
                    <footer className="">
                        <ChatPresence channel={channel} />
                    </footer>
                </section>
            </CollapsibleContent>
        </Collapsible>
    );
}
