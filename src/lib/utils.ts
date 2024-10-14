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

export function addOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;

    if (j === 1 && k !== 11) {
        return num + "st";
    }
    if (j === 2 && k !== 12) {
        return num + "nd";
    }
    if (j === 3 && k !== 13) {
        return num + "rd";
    }

    return num + "th";
}

const baseXP = 100;
const growthFactor = 1.5;

export const calculateLevel = (xp: number) => {
    if (xp < baseXP) return 0;

    return Math.floor(Math.log(xp / baseXP) / Math.log(growthFactor));
};

export const calculateXPForNextLevel = (currentLevel: number) => {
    return Math.ceil(baseXP * Math.pow(growthFactor, currentLevel + 1));
};

export const TOMATO_EMOJI = "🍅";
