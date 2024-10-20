import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useWorkStatus from "@/hooks/use-work-status";
import { CaretDownIcon, CaretUpIcon, ReloadIcon } from "@radix-ui/react-icons";

import { AlertCircleIcon, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import CountdownTimer from "../countdown-timer";
import SpinnerButton from "../spinner-button";

export default function WorkOverBanner() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        enabledTill,
        revalidatedAt,
        startsAt,
        refetchWorkStatus,
        isWorkStatusLoading,
    } = useWorkStatus();
    const [isWaitTimeDone, setWaitTimeDone] = useState(false);

    let time = null;

    if (enabledTill && Date.now() > new Date(enabledTill).getTime()) {
        // after expiry, use revalidated at (the time when stuff should get reset)
        time = revalidatedAt;
    } else if (startsAt && Date.now() < new Date(startsAt).getTime()) {
        // before the new expiry, so use starts at (record was updated, and now just wait till start time)
        time = startsAt;
    }

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="relative"
        >
            <CollapsibleTrigger className="flex bg-blue-800 w-full items-center gap-2 px-4 absolute top-0 z-50 justify-between">
                {!isOpen && (
                    <>
                        <div className="flex items-center gap-2">
                            <AlertCircleIcon className="size-3" /> Todays work
                            is over.{" "}
                        </div>
                        <div className="flex items-center gap-2">
                            {time && (
                                <CountdownTimer
                                    expireDate={time}
                                    className="text-muted-foreground"
                                />
                            )}
                            <CaretDownIcon />
                        </div>
                    </>
                )}
                {isOpen && (
                    <div className="w-full flex justify-end py-1">
                        <CaretUpIcon />
                    </div>
                )}
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-blue-800 ">
                <Alert className="bg-inherit py-6 border-none rounded-none px-12 ">
                    <AlertTitle className="flex items-center">
                        <AlertTriangle className="size-4 mr-2" /> Well, that's a
                        wrap! Today is officially DONE. 🎉
                    </AlertTitle>
                    <AlertDescription className="space-y-6">
                        <div className="text-white opacity-80 max-w-[40rem]">
                            The day's hustle has officially expired. Make sure
                            you swing by after{" "}
                            <span className="font-semibold">
                                {time && new Date(time).toLocaleString()}
                            </span>{" "}
                            to check off your accomplishments once again, and,
                            of course, shame the slackers.
                        </div>
                        <div className="flex items-start text-xs max-w-[29rem] text-white opacity-70">
                            <Info className="size-6 mr-2" />
                            We hit the reset button daily at{" "}
                            {time && new Date(time).toLocaleTimeString()},
                            wiping the slate clean and getting ready to judge
                            all over again. Make sure your tasks are checked off
                            by then, or else... 🍅👀
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <div className="space-x-2">
                                <span> Will re-enable in:</span>
                                {time && (
                                    <CountdownTimer
                                        onExpire={() => {
                                            setWaitTimeDone(true);
                                            refetchWorkStatus();
                                        }}
                                        expireDate={time}
                                    />
                                )}
                            </div>
                            {isWaitTimeDone && (
                                <div className="text-muted-foreground text-xs">
                                    <SpinnerButton
                                        isPending={isWorkStatusLoading}
                                        disabled={isWorkStatusLoading}
                                        disableWorkCheck={true}
                                        onClick={() => refetchWorkStatus()}
                                        size="sm"
                                    >
                                        <ReloadIcon className="size-3 mr-2" />{" "}
                                        Refresh
                                    </SpinnerButton>
                                </div>
                            )}
                        </div>
                    </AlertDescription>
                </Alert>
            </CollapsibleContent>
        </Collapsible>
    );
}
