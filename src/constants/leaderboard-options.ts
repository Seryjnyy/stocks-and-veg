import {
    Gathered,
    Received,
    Thrown,
    Tomato,
    Tomatoed,
    XP,
} from "@/components/leaderboard-icons";
import {
    CalendarCheck,
    CheckCircle,
    CircleX,
    SortAsc,
    SortDesc,
    TargetIcon,
    Trophy,
} from "lucide-react";

export const sortByOptions = [
    { value: "tomatoes", label: "current tomatoes", icon: Tomato },
    // { value: 'total_active_days', label: 'total active days' },
    {
        value: "day_full_completes",
        label: "fully completed days",
        icon: Trophy,
    },
    {
        value: "day_partial_completes",
        label: "partially completed days",
        icon: CalendarCheck,
    },
    {
        value: "tasks_completed",
        label: "tasks completed",
        icon: CheckCircle,
    },
    {
        value: "tasks_not_completed",
        label: "tasks not completed",
        icon: CircleX,
    },
    { value: "total_tomatos", label: "tomatoes gathered", icon: Gathered },
    { value: "tomatoes_thrown", label: "tomatoes thrown", icon: Thrown },
    { value: "tomatoes_received", label: "tomatoes received", icon: Received },
    { value: "times_being_a_target", label: "was a target", icon: TargetIcon },
    { value: "times_tomatoed", label: "was tomatoed", icon: Tomatoed },
    { value: "xp", label: "xp", icon: XP },
] as const;

export const orderOptions = [
    { value: "desc", label: "descending", icon: SortDesc },
    { value: "asc", label: "ascending", icon: SortAsc },
] as const;
