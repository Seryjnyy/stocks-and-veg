import useWorkStatus from "@/hooks/use-work-status";
import CountdownTimer from "../countdown-timer";
import { Clock } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const timerVariants = cva("flex items-center gap-1 [&>svg]:size-3 text-xs", {
    variants: {
        textColor: {
            default: "text-muted-foreground",
            primary: "text-blue-300",
        },
        withIcon: {
            true: "",
            false: "",
        },
    },
    defaultVariants: {
        textColor: "default",
        withIcon: true,
    },
});

interface WorkEnabledCountdownTimerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof timerVariants> {
    expired?: boolean;
}

export default function WorkEnabledCountdownTimer({
    className,
    textColor,
    withIcon = true,
    expired = false,
    ...props
}: WorkEnabledCountdownTimerProps) {
    const {
        enabledTill,
        refetchWorkStatus,
        isWorkStatusLoading,
        isWorkEnabled,
    } = useWorkStatus();

    if (!enabledTill) return null;

    const handleExpire = () => {
        // TODO : idk if good idea to refetch, cause if in multiple components it refetches each time
        // I either make work status refetch in interval or do this approach
        refetchWorkStatus();
    };

    if (isWorkStatusLoading) return <Skeleton className="w-24 h-4"></Skeleton>;

    const expiryDate = isWorkEnabled
        ? new Date(enabledTill).getTime()
        : Date.now();

    return (
        <div
            className={cn(timerVariants({ textColor, withIcon, className }))}
            {...props}
        >
            {withIcon && <Clock className="text-muted-foreground" />}
            {isWorkEnabled && !expired && (
                <CountdownTimer
                    onExpire={handleExpire}
                    expireDate={expiryDate}
                />
            )}
            {(!isWorkEnabled || expired) && <span>00:00:00:00</span>}
        </div>
    );
}
