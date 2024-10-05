import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
