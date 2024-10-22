import React, { forwardRef } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import useWorkStatus from "../hooks/use-work-status";

export interface SpinnerButtonProps extends ButtonProps {
    isPending: boolean;
    disableWorkCheck?: boolean;
}

const SpinnerButton = forwardRef<HTMLButtonElement, SpinnerButtonProps>(
    (
        {
            children,
            isPending,
            className,
            disabled,
            disableWorkCheck,
            ...props
        },
        ref
    ) => {
        const { isWorkEnabled } = useWorkStatus();

        const considerWorkStatus = disableWorkCheck ? true : isWorkEnabled;
        return (
            <Button
                {...props}
                ref={ref}
                className={cn("relative overflow-hidden", className)}
                disabled={disabled || isPending || !considerWorkStatus}
            >
                {isPending && (
                    <div className="absolute bg-inherit w-full h-full flex justify-center items-center ">
                        <Loader2 className="animate-spin size-3" />
                    </div>
                )}
                {!considerWorkStatus && (
                    <Clock className="size-3 mr-2 text-blue-400" />
                )}
                {children}
            </Button>
        );
    }
);

SpinnerButton.displayName = "SpinnerButton";

export default SpinnerButton;
