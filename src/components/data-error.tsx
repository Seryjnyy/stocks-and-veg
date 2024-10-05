import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DataError({ message }: { message: string }) {
    return (
        <Alert>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
