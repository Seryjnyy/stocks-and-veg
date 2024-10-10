import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { differenceInMilliseconds, set } from "date-fns";
import { cn, getExpiryDateUnixFromDate } from "@/lib/utils";

export default function CountdownTimer({
    className,
    expireDate,
}: {
    className?: string;
    expireDate: number;
}) {
    const [timeLeft, setTimeLeft] = useState<number | undefined>(undefined);

    useEffect(() => {
        const dateNow = Date.parse(new Date().toISOString());
        const dateExpiry = getExpiryDateUnixFromDate(expireDate);

        const timeDiff = Math.abs(
            differenceInMilliseconds(new Date(dateNow), dateExpiry)
        );

        if (dateNow > Date.parse(dateExpiry.toString())) {
            setTimeLeft(0);
        } else {
            setTimeLeft(dateNow + timeDiff);
        }
    }, []);

    if (!timeLeft) {
        return (
            <span className="text-muted-foreground text-xs">00:00:00:00</span>
        );
    }

    return (
        <Countdown
            precision={0}
            date={timeLeft}
            className={cn(className)}
        ></Countdown>
    );
}
