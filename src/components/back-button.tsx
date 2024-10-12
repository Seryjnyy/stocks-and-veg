import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface BackButtonProps {
    title?: string;
}

export default function BackButton({ title = "Back" }: BackButtonProps) {
    return (
        <Button variant="ghost" size={"sm"} className="group">
            <ArrowLeft className="size-3 mr-2  group-hover:-translate-x-1 transition-all" />
            {title}
        </Button>
    );
}
