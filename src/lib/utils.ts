import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONFIG } from "./config";
import { set } from "date-fns/set";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Probably inefficient to provide dateTime here too but more convenient
export const timestampSplit = (timestamp: string) => {
    const date = timestamp.split("T")[0];
    const time = timestamp.match(/T(\d{2}:\d{2})/)?.[1] ?? "";
    return {
        date: date,
        time: time,
        dateTime: `${date} - ${time}`,
    };
};

export const formatInviteLink = (token: string) => {
    return `${CONFIG.inviteURL}?token=${token}`;
};

export const getExpiryDateUnixFromDate = (date: number) => {
    return set(date, {
        hours: 23,
        minutes: 40,
        seconds: 0,
        milliseconds: 0,
    });
};

export const TOMATO_EMOJI = "🍅";
