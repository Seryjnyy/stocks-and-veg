import { ReactNode } from "@tanstack/react-router";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function TypeToConfirmAlertDialog({
    title,
    description,
    onConfirm,
    confirmText,
    buttonContent,
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText: string;
    buttonContent: ReactNode;
}) {
    const [confirmValue, setConfirmValue] = useState("");

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">{buttonContent}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-12">
                    <Label
                        htmlFor="confirm-delete-input"
                        className="font-normal"
                    >
                        Please type{" "}
                        <span className="font-bold">{confirmText}</span> to
                        confirm.
                    </Label>
                    <Input
                        id="confirm-delete-input"
                        value={confirmValue}
                        onChange={(e) => setConfirmValue(e.target.value)}
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={confirmValue != confirmText}
                        className={buttonVariants({
                            variant: "destructive",
                        })}
                    >
                        {buttonContent}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
