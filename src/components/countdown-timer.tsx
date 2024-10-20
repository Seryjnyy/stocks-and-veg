import { cn } from "@/lib/utils";
import { differenceInMilliseconds } from "date-fns";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";

export default function CountdownTimer({
    className,
    expireDate,
    onExpire,
}: {
    className?: string;
    expireDate: number;
    onExpire?: () => void;
}) {
    const [timeLeft, setTimeLeft] = useState<number | undefined>(undefined);

    useEffect(() => {
        const dateNow = Date.now();
        const dateExpiry = expireDate;

        const timeDiff = Math.abs(
            differenceInMilliseconds(new Date(dateNow), dateExpiry)
        );

        if (dateNow > dateExpiry) {
            setTimeLeft(0);
        } else {
            setTimeLeft(dateNow + timeDiff);
        }
    }, []);

    if (!timeLeft) {
        return <span className={cn(className)}>00:00:00:00</span>;
    }

    return (
        <Countdown
            onComplete={onExpire}
            precision={0}
            date={timeLeft}
            className={cn(className)}
        ></Countdown>
    );
}
