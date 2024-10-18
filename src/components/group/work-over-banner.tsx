import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

import { AlertCircleIcon, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

export default function WorkOverBanner() {
    const [isOpen, setIsOpen] = useState(false);

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
                        <CaretDownIcon />
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
                            you swing by after (time) to check off your
                            accomplishments once again, and, of course, shame
                            the slackers.
                        </div>
                        <div className="flex items-start text-xs max-w-[29rem] text-white opacity-70">
                            <Info className="size-6 mr-2" />
                            We hit the reset button daily at (time), wiping the
                            slate clean and getting ready to judge all over
                            again. Make sure your tasks are checked off by then,
                            or else... 🍅👀
                        </div>
                    </AlertDescription>
                </Alert>
            </CollapsibleContent>
        </Collapsible>
    );
}
