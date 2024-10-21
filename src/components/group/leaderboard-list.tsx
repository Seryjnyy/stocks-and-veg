import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useLeaderboard, { Order, SortBy } from "@/hooks/use-leaderboard";
import { addOrdinalSuffix, cn } from "@/lib/utils";
import { CaretDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Filter } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import GroupUserProfile from "./group-user-profile";
import { orderOptions, sortByOptions } from "@/constants/leaderboard-options";

export default function LeaderboardList({
    groupID,
    userID,
    userDetailSize = "2xl",
    userViewMore = false,
    viewStat = false,
}: {
    groupID: string;
    userID?: string;
    userDetailSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    userViewMore?: boolean;
    viewStat?: boolean;
}) {
    const { leaderboardData, isLoading, isError, sort } = useLeaderboard({
        groupID,
        userID,
    });

    const { sortBy, order, setOrder, setSortBy, defaultOrder, defaultSortBy } =
        sort;

    if (isLoading) return <Skeleton className="w-full h-10" />;

    if (isError || !leaderboardData) return null;

    const sortedBy = sortByOptions.find((option) => option.value == sortBy);
    const OrderedIcon = orderOptions.find(
        (option) => option.value == order
    )!.icon;

    const SortedByIcon = sortedBy!.icon;

    return (
        <div className="flex flex-col gap-1  w-full items-center ">
            <Collapsible className="w-full pb-8">
                <div className="flex justify-between gap-1">
                    <span className="text-sm text-muted-foreground items-center gap-3 flex w-fit ">
                        <span className="hidden sm:inline flex-shrink-0">
                            sorted by
                        </span>
                        <span className="font-bold">
                            <SortedByIcon className="mr-1 size-3   hidden sm:inline" />
                            {sortedBy?.label}
                        </span>
                        <OrderedIcon className="size-3 hidden sm:inline" />
                    </span>
                    <CollapsibleTrigger
                        asChild
                        className="w-full flex justify-end"
                    >
                        <Button
                            size={"sm"}
                            variant={"outline"}
                            className="w-fit ml-auto [&[data-state=open]>svg:first-child]:rotate-180"
                        >
                            <CaretDownIcon className="size-3 mr-2 " />
                            <Filter className="size-3" />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <div className="flex flex-col gap-3 py-8 animate-in fade-in-0 duration-500 ">
                        <div className="flex gap-3 items-center justify-between border-b pb-1">
                            <ToggleGroup
                                type="single"
                                value={order}
                                className="flex gap-1 flex-wrap "
                                onValueChange={(val: any) => {
                                    if (val != order) {
                                        setOrder(val as Order);
                                    }
                                }}
                            >
                                {orderOptions.map((ord) => {
                                    const Icon = ord.icon;
                                    return (
                                        <ToggleGroupItem
                                            value={ord.value}
                                            key={ord.value}
                                            className={cn(
                                                buttonVariants({
                                                    variant: "outline",
                                                    size: "sm",
                                                })
                                            )}
                                            disabled={ord.value == order}
                                        >
                                            <Icon className="size-3 mr-2" />
                                            {ord.label}
                                        </ToggleGroupItem>
                                    );
                                })}
                            </ToggleGroup>
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={() => {
                                    setSortBy(defaultSortBy);
                                    setOrder(defaultOrder);
                                }}
                            >
                                <ReloadIcon className="size-3 mr-2" /> Reset
                            </Button>
                        </div>
                        <ToggleGroup
                            type="single"
                            value={sortBy}
                            className="flex gap-1 flex-wrap"
                            onValueChange={(val: any) => {
                                if (val != sortBy) {
                                    setSortBy(val as SortBy);
                                }
                            }}
                        >
                            {sortByOptions.map((value) => {
                                const Icon = value.icon;
                                return (
                                    <ToggleGroupItem
                                        value={value.value}
                                        key={value.value}
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "sm",
                                            })
                                        )}
                                        disabled={sortBy == value.value}
                                    >
                                        <Icon className="size-3 mr-2" />
                                        {value.label}
                                    </ToggleGroupItem>
                                );
                            })}
                        </ToggleGroup>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            {leaderboardData.getAdjacentUsers(2).map((user) => (
                <div
                    key={user.user.user_id}
                    className={cn(
                        "border px- h-fit flex items-center rounded-md ",
                        user.position == leaderboardData.userPosition &&
                            "bg-secondary"
                    )}
                >
                    <span className="text-xs text-muted-foreground  w-[6ch] text-center">
                        {user.position <= 3
                            ? addOrdinalSuffix(user.position)
                            : user.position}
                    </span>
                    <GroupUserProfile
                        groupUser={user.user}
                        avatarSize={"md"}
                        detailSize={userDetailSize}
                        creatorBadge
                        usBadge
                        viewMore={userViewMore}
                    />
                    {viewStat && (
                        <div
                            className={cn(
                                " h-full border-l flex items-center justify-center px-2",
                                user.position == leaderboardData.userPosition &&
                                    "border-background/50"
                            )}
                        >
                            <div className="text-xs text-muted-foreground">
                                {user.value}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
