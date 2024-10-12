import { VariantProps } from "class-variance-authority";
import React from "react";
import { Button, buttonVariants } from "./components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "./lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isPending: boolean;
}
export default function SpinnerButton({
    children,
    isPending,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <Button
            {...props}
            className={cn("relative overflow-hidden", className)}
            disabled={disabled || isPending}
        >
            {isPending && (
                <div className="absolute bg-inherit w-full h-full flex justify-center items-center ">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            {children}
        </Button>
    );
}
