import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DataError({
    message,
    className,
}: {
    message: string;
    className?: string;
}) {
    return (
        <Alert variant={"destructive"} className={cn(className)}>
            <AlertTitle className="flex items-center  ">
                <AlertTriangle className="size-4  mr-2" />
                Error
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
