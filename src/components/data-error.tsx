import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DataError({ message }: { message: string }) {
    return (
        <Alert>
            <AlertTitle className="flex items-center">
                <AlertTriangle className="size-4  mr-2" />
                Error
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
