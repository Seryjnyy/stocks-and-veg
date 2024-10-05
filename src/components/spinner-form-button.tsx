import React from "react";
import { Button } from "./ui/button";
import { ReactNode } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export default function SpinnerFormButton({
    isPending,
    children,
}: {
    isPending: boolean;
    children: ReactNode;
}) {
    return (
        <Button
            type="submit"
            className="relative overflow-hidden"
            disabled={isPending}
        >
            {isPending && (
                <div className="absolute bg-inherit w-full h-full flex justify-center items-center ">
                    <Loader2 className="animate-spin text-accent" />
                </div>
            )}
            {children}
        </Button>
    );
}
