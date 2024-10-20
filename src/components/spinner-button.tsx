import { VariantProps } from "class-variance-authority";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import useWorkStatus from "../hooks/use-work-status";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isPending: boolean;
    disableWorkCheck?: boolean;
}
// TODO : what a stupid way to do this with disable work check, I need to separate components because its just dumb
export default function SpinnerButton({
    children,
    isPending,
    className,
    disabled,
    disableWorkCheck,
    ...props
}: ButtonProps) {
    const { isWorkEnabled } = useWorkStatus();

    const considerWorkStatus = disableWorkCheck ? true : isWorkEnabled;
    return (
        <Button
            {...props}
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
