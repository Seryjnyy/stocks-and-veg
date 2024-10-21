import { cn } from "@/lib/utils";
import { TargetIcon } from "lucide-react";

export const Tomato = ({ className }: { className?: string }) => {
    return <span className={cn("mr-2", className)}>🍅</span>;
};

export const Thrown = ({ className }: { className?: string }) => {
    return <span className={cn("mr-2", className)}>🤾</span>;
};

export const Received = ({ className }: { className?: string }) => {
    return <span className={cn("mr-2", className)}>🎯</span>;
};

export const Gathered = ({ className }: { className?: string }) => {
    return <span className={cn("mr-2", className)}>🧺</span>;
};

export const Tomatoed = ({ className }: { className?: string }) => {
    return (
        <span className={cn("relative w-fit mr-2", className)}>
            <TargetIcon className="size-3 " />
            <span className="absolute bottom-0 -left-2 ">🍅</span>
        </span>
    );
};

export const XP = ({ className }: { className?: string }) => {
    return <span className={cn("mr-2", className)}>✨</span>;
};
