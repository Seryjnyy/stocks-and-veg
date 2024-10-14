import GroupUserDialog from "@/components/group/group-user-dialog";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/use-auth";

import GroupUserProfile, {
    GroupUserAvatar,
    UserDetail,
} from "@/components/group/group-user-profile";
import { useGetGroupUser } from "@/lib/hooks/queries/use-get-group-user";
import { cn } from "@/lib/utils";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { useState } from "react";

import CountdownTimer from "@/components/countdown-timer";
import { currentSectionInGroupPageAtom } from "@/lib/atoms/current-section-group-page";
import { useAtom } from "jotai";
import { GroupSection } from "@/lib/types";

const Sidebar = ({
    sections,
    groupID,
}: {
    groupID: string;
    sections: GroupSection[];
}) => {
    const { session } = useAuth();
    const [expanded, setExpanded] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // TODO : well don't need jotai rn, but If at some point sidebar is split it could be useful -\o/-
    const [currentSection, _] = useAtom(currentSectionInGroupPageAtom);

    const { data: groupUser } = useGetGroupUser({
        groupID: groupID,
        userID: session?.user.id,
        enabled: !!session,
    });

    return (
        <>
            <aside
                className={cn(
                    " border-r  transition-all z-50 bg-[#0f0f10] hidden md:block",
                    expanded ? "w-64" : "w-20"
                )}
            >
                <nav className="h-full flex flex-col">
                    <div className="p-4 pb-2 flex justify-between items-center border-b">
                        <Button
                            variant="outline"
                            className="p-2 w-full"
                            onClick={() => setExpanded((curr) => !curr)}
                        >
                            <span>
                                {expanded ? <SidebarClose /> : <SidebarOpen />}
                            </span>
                        </Button>
                    </div>

                    <ul className="flex-1 px-3 mt-12">
                        <LinkList
                            sections={sections}
                            expanded={expanded}
                            currentSection={currentSection}
                        />
                    </ul>

                    <TimeRemaining expanded={expanded} />
                    <div className="border-t flex p-3  ">
                        <div
                            className={cn(
                                "flex items-center   w-full",
                                expanded
                                    ? "w-full justify-between cursor-auto"
                                    : "justify-center cursor-pointer"
                            )}
                            onClick={() => {
                                !expanded && setExpanded(true);
                            }}
                        >
                            <div
                                className={cn(
                                    "flex items-center ",
                                    expanded && "gap-3"
                                )}
                            >
                                {groupUser && (
                                    <div className="flex items-center justify-between w-full gap-5 h-full relative">
                                        <GroupUserAvatar
                                            groupUser={groupUser}
                                            creatorBadge
                                        />

                                        <div
                                            className={cn(
                                                "flex items-center w-full overflow-hidden transition-opacity duration-200 gap-2",
                                                expanded
                                                    ? "w-full opacity-100"
                                                    : "w-0 absolute  opacity-0"
                                            )}
                                        >
                                            {expanded && groupUser.profile && (
                                                <>
                                                    <UserDetail
                                                        user={groupUser.profile}
                                                        size={"md"}
                                                    />
                                                    <GroupUserDialog
                                                        groupUser={groupUser}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>

            <div className="md:hidden">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="outline"
                            className="p-2 px-3 fixed top-20 left-4 z-50"
                            onClick={() => setExpanded((curr) => !curr)}
                        >
                            <span>
                                {drawerOpen ? (
                                    <SidebarClose />
                                ) : (
                                    <SidebarOpen />
                                )}
                            </span>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Group menu</DrawerTitle>
                            <DrawerDescription className="sr-only">
                                This is the group menu where you can find group
                                section links and your info.
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="border-t flex justify-center">
                            <div className="mx-auto ">
                                <ul className="flex-1 px-3 my-12 ">
                                    <LinkList
                                        onClickLink={() => {
                                            setDrawerOpen(false);
                                        }}
                                        sections={sections}
                                        expanded={true}
                                        currentSection={currentSection}
                                    />
                                </ul>
                            </div>
                        </div>

                        <TimeRemaining expanded={true} className="border-t" />
                        <div className="flex justify-center border-t">
                            {groupUser && (
                                <GroupUserProfile
                                    groupUser={groupUser}
                                    viewMore
                                    detailSize={"xl"}
                                />
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
};

const TimeRemaining = ({
    expanded,
    className,
}: {
    expanded: boolean;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-4",
                className
            )}
        >
            <span
                className={cn(
                    "text-muted-foreground text-xs transition-all opacity-0 w-0",
                    expanded && "opacity-100 w-fit delay-200"
                )}
            >
                {expanded && "Time remaining today to do tasks."}
            </span>
            <CountdownTimer
                className=" text-blue-400 text-xs"
                expireDate={Date.parse(new Date().toISOString())}
            />
        </div>
    );
};

const LinkList = ({
    sections,
    expanded,
    currentSection,
    onClickLink,
}: {
    sections: GroupSection[];
    expanded: boolean;
    currentSection: string;
    onClickLink?: (value: string) => void;
}) => {
    return sections.map((item, index) => (
        <li key={index}>
            <a href={`#${item.value}`}>
                <Button
                    variant="ghost"
                    className={cn(
                        "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group w-full",
                        expanded ? "justify-start" : "justify-center"
                    )}
                    onClick={() => onClickLink?.(item.value)}
                >
                    <item.icon
                        className={cn(
                            "w-5 h-5",
                            expanded && "mr-2",
                            currentSection == item.value && "text-blue-500"
                        )}
                    />
                    <span
                        className={cn(
                            expanded
                                ? "opacity-100"
                                : "opacity-0 overflow-hidden w-0",
                            "transition-all"
                        )}
                    >
                        {item.label}
                    </span>
                    {!expanded && (
                        <div
                            className={cn(
                                "absolute left-full rounded-md px-2 py-1 ml-6",
                                "bg-indigo-100 text-indigo-800 text-sm",
                                "invisible opacity-20 -translate-x-3 transition-all",
                                "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                            )}
                        >
                            {item.label}
                        </div>
                    )}
                </Button>
            </a>
        </li>
    ));
};

export default Sidebar;
